import React, { useEffect, useRef, useState } from "react";
import { parseLogoImage } from "./parse-logo";
import { liquidFragSource, vertexShaderSource } from "./shader";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  imageUrl: string;
  patternScale?: number;
  refraction?: number;
  edge?: number;
  patternBlur?: number;
  liquid?: number;
  speed?: number;
  showProcessing?: boolean;
}

export const LiquidLogo: React.FC<Props> = ({
  className,
  imageUrl,
  refraction = 0.015,
  edge = 0.4,
  patternScale = 2,
  patternBlur = 0.005,
  liquid = 0.07,
  speed = 0.3,
  showProcessing = true,
}) => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation>>({});
  const animationRef = useRef<number>(0);
  const totalAnimationTimeRef = useRef(0);
  const lastRenderTimeRef = useRef(0);

  useEffect(() => {
    const process = async () => {
      setProcessing(true);
      try {
        const { imageData: imgData } = await parseLogoImage(imageUrl);
        setImageData(imgData);
      } catch (error) {
        console.error("Failed to process logo image:", error);
      } finally {
        setProcessing(false);
      }
    };
    process();
  }, [imageUrl]);

  useEffect(() => {
    if (!imageData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: true,
    });

    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    glRef.current = gl;

    // Shader initialization
    const createShader = (gl: WebGL2RenderingContext, source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, liquidFragSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();

    if (!program || !vertexShader || !fragmentShader) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    const getUniforms = (program: WebGLProgram, gl: WebGL2RenderingContext) => {
      const uniforms: Record<string, WebGLUniformLocation> = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) continue;
        const location = gl.getUniformLocation(program, info.name);
        if (location) uniforms[info.name] = location;
      }
      return uniforms;
    };

    uniformsRef.current = getUniforms(program, gl);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Texture setup
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imageData.width, imageData.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData.data);
    
    if (uniformsRef.current.u_image_texture) {
        gl.uniform1i(uniformsRef.current.u_image_texture, 0);
    }

    const updateStaticUniforms = () => {
        if (!glRef.current || !uniformsRef.current) return;
        const gl = glRef.current;
        const u = uniformsRef.current;
        if (u.u_edge) gl.uniform1f(u.u_edge, edge);
        if (u.u_patternBlur) gl.uniform1f(u.u_patternBlur, patternBlur);
        if (u.u_patternScale) gl.uniform1f(u.u_patternScale, patternScale);
        if (u.u_refraction) gl.uniform1f(u.u_refraction, refraction);
        if (u.u_liquid) gl.uniform1f(u.u_liquid, liquid);
    };

    updateStaticUniforms();

    const resize = () => {
      const canvas = canvasRef.current;
      const gl = glRef.current;
      if (!canvas || !gl) return;

      const imgRatio = imageData.width / imageData.height;
      const side = 1000;
      canvas.width = side * window.devicePixelRatio;
      canvas.height = side * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      const u = uniformsRef.current;
      if (u.u_ratio) gl.uniform1f(u.u_ratio, 1);
      if (u.u_img_ratio) gl.uniform1f(u.u_img_ratio, imgRatio);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = (time: number) => {
      const gl = glRef.current;
      const u = uniformsRef.current;
      if (!gl || !u) return;

      const deltaTime = time - lastRenderTimeRef.current;
      lastRenderTimeRef.current = time;
      totalAnimationTimeRef.current += deltaTime * speed;

      if (u.u_time) gl.uniform1f(u.u_time, totalAnimationTimeRef.current);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    lastRenderTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
      if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    };
  }, [imageData, edge, patternBlur, patternScale, refraction, liquid, speed]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {processing && showProcessing && (
        <div className="absolute inset-0 flex items-center justify-center text-primary/50 text-2xl font-bold">
          <span>Processing Logo</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={cn(
          "block h-full w-full object-contain transition-opacity duration-500",
          processing ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
};
