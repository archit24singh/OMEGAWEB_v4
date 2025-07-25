/**
 * LightRays - WebGL Shader-based Implementation (Vanilla JS)
 * Based on the React component with proper WebGL shaders
 */
class LightRays {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        
        // Default options matching the React component
        this.options = {
            raysOrigin: 'top-center',
            raysColor: '#ffffff',
            raysSpeed: 1,
            lightSpread: 1,
            rayLength: 2,
            pulsating: false,
            fadeDistance: 1.0,
            saturation: 1.0,
            followMouse: true,
            mouseInfluence: 0.1,
            noiseAmount: 0.0,
            distortion: 0.0,
            className: '',
            ...options
        };

        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.mousePos = { x: 0.5, y: 0.5 };
        this.smoothMouse = { x: 0.5, y: 0.5 };
        this.animationId = null;
        this.startTime = Date.now();
        this.isVisible = false;

        this.init();
    }

    hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? [
            parseInt(m[1], 16) / 255,
            parseInt(m[2], 16) / 255,
            parseInt(m[3], 16) / 255,
        ] : [1, 1, 1];
    }

    getAnchorAndDir(origin, w, h) {
        const outside = 0.2;
        switch (origin) {
            case "top-left":
                return { anchor: [0, -outside * h], dir: [0, 1] };
            case "top-right":
                return { anchor: [w, -outside * h], dir: [0, 1] };
            case "left":
                return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
            case "right":
                return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
            case "bottom-left":
                return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
            case "bottom-center":
                return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
            case "bottom-right":
                return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
            default: // "top-center"
                return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
        }
    }

    init() {
        if (!this.container) {
            console.error('LightRays: Container not found');
            return;
        }

        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            const wasVisible = this.isVisible;
            this.isVisible = entry.isIntersecting;
            
            if (this.isVisible && !wasVisible) {
                this.initWebGL();
            } else if (!this.isVisible && wasVisible) {
                this.cleanup();
            }
        }, { threshold: 0.1 });

        observer.observe(this.container);
    }

    initWebGL() {
        if (!this.container) return;

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.className = this.options.className;

        // Add canvas as background (don't clear existing content)
        this.container.insertBefore(this.canvas, this.container.firstChild);

        // Get WebGL context
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        this.setupWebGL();
        this.setupEventListeners();
        this.resize();
        this.animate();
    }

    setupWebGL() {
        const gl = this.gl;

        // Vertex shader
        const vertexShaderSource = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // Fragment shader (matching the React component exactly)
        const fragmentShaderSource = `
            precision highp float;

            uniform float iTime;
            uniform vec2  iResolution;

            uniform vec2  rayPos;
            uniform vec2  rayDir;
            uniform vec3  raysColor;
            uniform float raysSpeed;
            uniform float lightSpread;
            uniform float rayLength;
            uniform float pulsating;
            uniform float fadeDistance;
            uniform float saturation;
            uniform vec2  mousePos;
            uniform float mouseInfluence;
            uniform float noiseAmount;
            uniform float distortion;

            varying vec2 vUv;

            float noise(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                              float seedA, float seedB, float speed) {
                vec2 sourceToCoord = coord - raySource;
                vec2 dirNorm = normalize(sourceToCoord);
                float cosAngle = dot(dirNorm, rayRefDirection);

                float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
                
                float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

                float distance = length(sourceToCoord);
                float maxDistance = iResolution.x * rayLength;
                float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
                
                float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
                float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

                float baseStrength = clamp(
                    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
                    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
                    0.0, 1.0
                );

                return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
            }

            void mainImage(out vec4 fragColor, in vec2 fragCoord) {
                vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
                
                vec2 finalRayDir = rayDir;
                if (mouseInfluence > 0.0) {
                    vec2 mouseScreenPos = mousePos * iResolution.xy;
                    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
                    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
                }

                vec4 rays1 = vec4(1.0) *
                             rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                                         1.5 * raysSpeed);
                vec4 rays2 = vec4(1.0) *
                             rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                                         1.1 * raysSpeed);

                fragColor = rays1 * 0.5 + rays2 * 0.4;

                if (noiseAmount > 0.0) {
                    float n = noise(coord * 0.01 + iTime * 0.1);
                    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
                }

                float brightness = 1.0 - (coord.y / iResolution.y);
                fragColor.x *= 0.1 + brightness * 0.8;
                fragColor.y *= 0.3 + brightness * 0.6;
                fragColor.z *= 0.5 + brightness * 0.5;

                if (saturation != 1.0) {
                    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
                    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
                }

                fragColor.rgb *= raysColor;
            }

            void main() {
                vec4 color;
                mainImage(color, gl_FragCoord.xy);
                gl_FragColor = color;
            }
        `;

        // Create and compile shaders
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        // Create program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Program linking failed:', gl.getProgramInfoLog(this.program));
            return;
        }

        // Create geometry (fullscreen triangle)
        const positions = new Float32Array([
            -1, -1,
             3, -1,
            -1,  3
        ]);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(this.program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Get uniform locations
        this.uniforms = {
            iTime: gl.getUniformLocation(this.program, 'iTime'),
            iResolution: gl.getUniformLocation(this.program, 'iResolution'),
            rayPos: gl.getUniformLocation(this.program, 'rayPos'),
            rayDir: gl.getUniformLocation(this.program, 'rayDir'),
            raysColor: gl.getUniformLocation(this.program, 'raysColor'),
            raysSpeed: gl.getUniformLocation(this.program, 'raysSpeed'),
            lightSpread: gl.getUniformLocation(this.program, 'lightSpread'),
            rayLength: gl.getUniformLocation(this.program, 'rayLength'),
            pulsating: gl.getUniformLocation(this.program, 'pulsating'),
            fadeDistance: gl.getUniformLocation(this.program, 'fadeDistance'),
            saturation: gl.getUniformLocation(this.program, 'saturation'),
            mousePos: gl.getUniformLocation(this.program, 'mousePos'),
            mouseInfluence: gl.getUniformLocation(this.program, 'mouseInfluence'),
            noiseAmount: gl.getUniformLocation(this.program, 'noiseAmount'),
            distortion: gl.getUniformLocation(this.program, 'distortion')
        };

        gl.useProgram(this.program);
        this.updateUniforms();
    }

    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    updateUniforms() {
        if (!this.gl || !this.program) return;

        const gl = this.gl;
        const rect = this.container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio, 2);
        const w = rect.width * dpr;
        const h = rect.height * dpr;

        const { anchor, dir } = this.getAnchorAndDir(this.options.raysOrigin, w, h);
        const color = this.hexToRgb(this.options.raysColor);

        gl.uniform1f(this.uniforms.iTime, (Date.now() - this.startTime) * 0.001);
        gl.uniform2f(this.uniforms.iResolution, w, h);
        gl.uniform2f(this.uniforms.rayPos, anchor[0], anchor[1]);
        gl.uniform2f(this.uniforms.rayDir, dir[0], dir[1]);
        gl.uniform3f(this.uniforms.raysColor, color[0], color[1], color[2]);
        gl.uniform1f(this.uniforms.raysSpeed, this.options.raysSpeed);
        gl.uniform1f(this.uniforms.lightSpread, this.options.lightSpread);
        gl.uniform1f(this.uniforms.rayLength, this.options.rayLength);
        gl.uniform1f(this.uniforms.pulsating, this.options.pulsating ? 1.0 : 0.0);
        gl.uniform1f(this.uniforms.fadeDistance, this.options.fadeDistance);
        gl.uniform1f(this.uniforms.saturation, this.options.saturation);
        gl.uniform2f(this.uniforms.mousePos, this.smoothMouse.x, this.smoothMouse.y);
        gl.uniform1f(this.uniforms.mouseInfluence, this.options.mouseInfluence);
        gl.uniform1f(this.uniforms.noiseAmount, this.options.noiseAmount);
        gl.uniform1f(this.uniforms.distortion, this.options.distortion);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        if (this.options.followMouse) {
            const handleMouseMove = (e) => {
                if (!this.container) return;
                const rect = this.container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                this.mousePos = { x, y };
            };

            window.addEventListener('mousemove', handleMouseMove);
        }
    }

    resize() {
        if (!this.canvas || !this.gl) return;

        const rect = this.container.getBoundingClientRect();
        // Optimize for mobile: reduce pixel density on smaller screens
        const isMobile = window.innerWidth <= 768;
        const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        if (!this.gl || !this.isVisible) return;

        // Smooth mouse movement
        if (this.options.followMouse && this.options.mouseInfluence > 0.0) {
            const smoothing = 0.92;
            this.smoothMouse.x = this.smoothMouse.x * smoothing + this.mousePos.x * (1 - smoothing);
            this.smoothMouse.y = this.smoothMouse.y * smoothing + this.mousePos.y * (1 - smoothing);
        }

        this.updateUniforms();
        
        // Clear and draw
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.gl) {
            const loseContextExt = this.gl.getExtension('WEBGL_lose_context');
            if (loseContextExt) {
                loseContextExt.loseContext();
            }
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        this.canvas = null;
        this.gl = null;
        this.program = null;
    }

    destroy() {
        this.cleanup();
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        if (this.gl) {
            this.updateUniforms();
        }
    }
}

// Export for module systems or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LightRays;
} else if (typeof window !== 'undefined') {
    window.LightRays = LightRays;
}