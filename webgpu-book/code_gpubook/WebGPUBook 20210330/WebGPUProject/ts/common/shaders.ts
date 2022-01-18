export class Ch02Shaders {    
    public static wgslShaders = {
        vertex: `
            const pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
                vec2<f32>(0.0, 0.5),
                vec2<f32>(-0.5, -0.5),
                vec2<f32>(0.5, -0.5));

            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[builtin(vertex_idx)]] var<in> VertexIndex : i32;

            [[stage(vertex)]]
            fn main() -> void {
              Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
              return;
            }`,
        fragment: `
            [[location(0)]] var<out> outColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
              outColor = vec4<f32>(1.0, 1.0, 1.0, 1.0);
              return;
            }`
    };

    public static glslShaders = {
        vertex: `#version 450
            const vec2 pos[3] = vec2[3](vec2(0.0f, 0.5f), vec2(-0.5f, -0.5f), vec2(0.5f, -0.5f));
            void main() {
                gl_Position = vec4(pos[gl_VertexIndex], 0.0, 1.0);
            }`,
        fragment: `#version 450
              layout(location = 0) out vec4 outColor;
              void main() {
                  outColor = vec4(1.0, 1.0, 1.0, 1.0);
              }`
    };
}

export class Ch03Shaders {
    public static wgslShaders = {
        vertex: `
            const pos : array<vec2<f32>, 6> = array<vec2<f32>, 6>(             
                vec2<f32>(-0.5,  0.7),
                vec2<f32>( 0.3,  0.6),
                vec2<f32>( 0.5,  0.3),
                vec2<f32>( 0.4, -0.5),
                vec2<f32>(-0.4, -0.4),
                vec2<f32>(-0.3,  0.2)
                );

            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[builtin(vertex_idx)]] var<in> VertexIndex : i32;

            [[stage(vertex)]]
            fn main() -> void {
              Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
              return;
            }`,
        fragment: `
            [[location(0)]] var<out> outColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
              outColor = vec4<f32>(1.0, 1.0, 0.0, 1.0);
              return;
            }`
    };

    public static glslShaders = {
        vertex: `#version 450
                 const vec2 pos[6] = vec2[6](             
                vec2(-0.5f,  0.7f),
                vec2( 0.3f,  0.6f),
                vec2( 0.5f,  0.3f),
                vec2( 0.4f, -0.5f),
                vec2(-0.4f, -0.4f),
                vec2(-0.3f,  0.2f)
                );

            void main() {
                gl_Position = vec4(pos[gl_VertexIndex], 0.0, 1.0);
            }`,
        
        fragment: `#version 450
              layout(location = 0) out vec4 outColor;
              void main() {
                  outColor = vec4(1.0, 1.0, 0.0, 1.0);
              }`
    };

    public static wgslShadersTriangle = {
        vertex: `
            const pos : array<vec2<f32>, 9> = array<vec2<f32>, 9>(             
                vec2<f32>(-0.63,  0.80),
                vec2<f32>(-0.65,  0.20),
                vec2<f32>(-0.20,  0.60),
                vec2<f32>(-0.37, -0.07),
                vec2<f32>( 0.05,  0.18),
                vec2<f32>(-0.13, -0.40),
                vec2<f32>( 0.30, -0.13),
                vec2<f32>( 0.13, -0.64),
                vec2<f32>( 0.70, -0.30)               
                );

            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[builtin(vertex_idx)]] var<in> VertexIndex : i32;

            [[stage(vertex)]]
            fn main() -> void {
              Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
              return;
            }`,

        fragment: `
            [[location(0)]] var<out> outColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
              outColor = vec4<f32>(1.0, 1.0, 0.0, 1.0);
              return;
            }`
    };

    public static glslShadersTriangle = {
        vertex: `#version 450
                const vec2 pos[9] = vec2[9](   
                vec2(-0.63,  0.80),
                vec2(-0.65,  0.20),
                vec2(-0.20,  0.60),
                vec2(-0.37, -0.07),
                vec2( 0.05,  0.18),
                vec2(-0.13, -0.40),
                vec2( 0.30, -0.13),
                vec2( 0.13, -0.64),
                vec2( 0.70, -0.30)         
                );

            void main() {
                gl_Position = vec4(pos[gl_VertexIndex], 0.0, 1.0);
            }`,
        
        fragment: `#version 450
              layout(location = 0) out vec4 outColor;
              void main() {
                  outColor = vec4(1.0, 1.0, 0.0, 1.0);
              }`
    };
}

export class Ch04Shaders {
    public static wgslShaders = {
        vertex: `
            [[location(0)]] var<in> position : vec4<f32>;
            [[location(1)]] var<in> color : vec4<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vColor : vec4<f32>;
        
            [[stage(vertex)]]
            fn main() -> void {
                Position = position;
                vColor = color;
                return;
            }`,

        fragment: `
            [[location(0)]] var<in> vColor : vec4<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
                fragColor = vColor;
                return;
            }`
    }

    public static glslShaders = {
        vertex: `#version 450
            layout(location=0) in vec4 position;
            layout(location=1) in vec4 color;
            layout(location=0) out vec4 vColor;
    
            void main() {
                vColor = color;
                gl_Position = position;
            }`,

        fragment: `#version 450    
            layout(location=0) in vec4 vColor;
            layout(location=0) out vec4 fragColor;

            void main() {
                fragColor = vColor;
            }`
    }
}

export class Ch06Shaders {
    public static wgslShaders = {
        vertex: `
            [[block]] struct Uniforms {
                [[offset(0)]] mvpMatrix : mat4x4<f32>;
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;
            [[location(0)]] var<in> position : vec4<f32>;
            [[location(1)]] var<in> color : vec3<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vColor : vec3<f32>;
        
            [[stage(vertex)]]
            fn main() -> void {
                Position = uniforms.mvpMatrix * position;
                vColor = color;
                return;
            }`,

        fragment: `
            [[location(0)]] var<in> vColor : vec3<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
                fragColor = vec4<f32>(vColor, 1.0);
                return;
            }`
    }

    public static glslShaders = {
        vertex: `
            #version 450
            layout(location=0) in vec4 position;
            layout(location=1) in vec3 color;
            layout(set=0, binding=0) uniform SceneUniforms {
                mat4 mvpMatrix;
            };
            layout(location=0) out vec3 vColor;

            void main() {
                vColor = color;
                gl_Position =  mvpMatrix * position;
            }`,

        fragment: `
            #version 450    
            layout(location=0) in vec3 vColor;
            layout(location=0) out vec4 fragColor;

            void main() {
                fragColor = vec4(vColor, 1.0);
            }`
    }

    public static wgslShadersLine = {
        vertex: `
            [[block]] struct Uniforms {
                [[offset(0)]] mvpMatrix : mat4x4<f32>;
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;
            [[location(0)]] var<in> position : vec4<f32>;            
            [[builtin(position)]] var<out> Position : vec4<f32>;
            
            [[stage(vertex)]]
            fn main() -> void {
                Position = uniforms.mvpMatrix * position;                
                return;
            }`,

        fragment: `
            [[location(0)]] var<out> outColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
            outColor = vec4<f32>(1.0, 1.0, 0.0, 1.0);
            return;
            }`
    };

    public static glslShadersLine = {
        vertex: `
            #version 450
            layout(location=0) in vec4 position;            
            layout(set=0, binding=0) uniform SceneUniforms {
                mat4 mvpMatrix;
            };           

            void main() {               
                gl_Position =  mvpMatrix * position;
            }`,

        fragment: `
            #version 450              
            layout(location=0) out vec4 fragColor;

            void main() {
                fragColor = vec4(1.0, 1.0, 0.0, 1.0);
            }`
    };
}

export class Ch08Shaders {
    public static color: string = '(1.0, 0.0, 0.0)';
    public static ambientIntensity: string = '0.2';
    public static diffuseIntensity: string = '0.8';
    public static specularIntensity: string = '0.4';
    public static shininess: string = '30.0';
    public static specularColor: string = '(1.0, 1.0, 1.0)';
    public static isPhong: string = '0';

    public static wgslShaders() {
        const vertex = `
            [[block]] struct Uniforms {
                [[offset(0)]] viewProjectionMatrix : mat4x4<f32>;
                [[offset(64)]] modelMatrix : mat4x4<f32>;               
                [[offset(128)]] normalMatrix : mat4x4<f32>;
                
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;

            [[location(0)]] var<in> position : vec4<f32>;
            [[location(1)]] var<in> normal : vec4<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vPosition : vec4<f32>;
            [[location(1)]] var<out> vNormal : vec4<f32>;
        
            [[stage(vertex)]]
            fn main() -> void {                
                const mPosition:vec4<f32> = uniforms.modelMatrix * position; 
                vPosition = mPosition;                  
                vNormal =  uniforms.normalMatrix*normal;
                Position = uniforms.viewProjectionMatrix * mPosition;               
                return;
            }`;

        const fragment = `
            [[block]] struct Uniforms {
                [[offset(0)]] lightPosition : vec4<f32>;   
                [[offset(16)]] eyePosition : vec4<f32>;
            };
            [[binding(1), group(0)]] var<uniform> uniforms : Uniforms;

            [[location(0)]] var<in> vPosition : vec4<f32>;
            [[location(1)]] var<in> vNormal : vec4<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
                const N:vec3<f32> = normalize(vNormal.xyz);                
                const L:vec3<f32> = normalize(uniforms.lightPosition.xyz - vPosition.xyz);     
                const V:vec3<f32> = normalize(uniforms.eyePosition.xyz - vPosition.xyz);          
                const H:vec3<f32> = normalize(L + V);
                const diffuse:f32 = ${this.diffuseIntensity} * max(dot(N, L), 0.0);
                var specular:f32;
                var isp:i32 = ${this.isPhong};
                if(isp == 1){
                    specular = ${this.specularIntensity} * pow(max(dot(V, reflect(-L, N)),0.0), ${this.shininess});
                } else {
                    specular = ${this.specularIntensity} * pow(max(dot(N, H),0.0), ${this.shininess});
                }               
                const ambient:f32 = ${this.ambientIntensity};               
                const finalColor:vec3<f32> = vec3<f32>${this.color}*(ambient + diffuse) + vec3<f32>${this.specularColor}*specular; 
                fragColor = vec4<f32>(finalColor, 1.0);
                return;
            }`;
        return {vertex, fragment};
    }


    public static glslShaders() {
        const vertex = `
            #version 450
            layout(location=0) in vec4 position;
            layout(location=1) in vec4 normal;
            
            layout(set=0, binding=0) uniform VertexUniforms {
                mat4 viewProjectionMatrix;
                mat4 modelMatrix;               
                mat4 normalMatrix;
            };

            layout(location=0) out vec4 vPosition;
            layout(location=1) out vec4 vNormal;
        
            void main() {
                vec4 mPosition = modelMatrix * position;
                vPosition = mPosition;                
                vNormal = normalMatrix * normal;                             
                gl_Position = viewProjectionMatrix * mPosition;
            }`;

        const fragment = `
            #version 450    
            layout(location=0) in vec4 vPosition;
            layout(location=1) in vec4 vNormal;
        
            layout(set=0, binding=1) uniform FragmentUniforms {
                vec4 lightPosition;
                vec4 eyePosition;
            };
            layout(location=0) out vec4 fragColor;

            void main() {
                vec3 N = normalize(vNormal.xyz);                
                vec3 L = normalize(lightPosition.xyz - vPosition.xyz);      
                vec3 V = normalize(eyePosition.xyz - vPosition.zyx);          
                vec3 H = normalize(L + V); 
                float diffuse = ${this.diffuseIntensity} * max(dot(N, L), 0.0); 
                int isp = ${this.isPhong};
                float specular;
                if(isp == 1){               
                    specular = ${this.specularIntensity} * pow(max(dot(V, reflect(-L, N)), 0.0), ${this.shininess});
                } else{
                    specular = ${this.specularIntensity} * pow(max(dot(N, H), 0.0), ${this.shininess});
                }
                vec3 finalColor = vec3${this.color} * (${this.ambientIntensity} + diffuse) + vec3${this.specularColor}*specular;  
                fragColor = vec4(finalColor, 1.0);
            }`;
        return {vertex, fragment};
    }
}

export class Ch09Shaders {
    public static ambientIntensity: string = '0.2';
    public static diffuseIntensity: string = '0.8';
    public static specularIntensity: string = '0.4';
    public static shininess: string = '30.0';
    public static specularColor: string = '(1.0, 1.0, 1.0)';
    public static isPhong: string = '0';
    public static isTwoSideLighting = '1';

    public static wgslShaders() {
        const vertex = `
            [[block]] struct Uniforms {
                [[offset(0)]] viewProjectionMatrix : mat4x4<f32>;
                [[offset(64)]] modelMatrix : mat4x4<f32>;               
                [[offset(128)]] normalMatrix : mat4x4<f32>;                
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;

            [[location(0)]] var<in> position : vec4<f32>;
            [[location(1)]] var<in> normal : vec4<f32>;
            [[location(2)]] var<in> color : vec3<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vPosition : vec4<f32>;
            [[location(1)]] var<out> vNormal : vec4<f32>;
            [[location(2)]] var<out> vColor : vec3<f32>;
        
            [[stage(vertex)]]
            fn main() -> void {                
                const mPosition:vec4<f32> = uniforms.modelMatrix * position; 
                vPosition = mPosition;                  
                vNormal =  uniforms.normalMatrix*normal;
                Position = uniforms.viewProjectionMatrix * mPosition;     
                vColor = color;          
                return;
            }`;

        const fragment = `
            [[block]] struct Uniforms {
                [[offset(0)]] lightPosition : vec4<f32>;   
                [[offset(16)]] eyePosition : vec4<f32>;
            };
            [[binding(1), group(0)]] var<uniform> uniforms : Uniforms;

            [[location(0)]] var<in> vPosition : vec4<f32>;
            [[location(1)]] var<in> vNormal : vec4<f32>;
            [[location(2)]] var<in> vColor : vec3<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;
        
            [[stage(fragment)]]
            fn main() -> void {
                const N:vec3<f32> = normalize(vNormal.xyz);                
                const L:vec3<f32> = normalize(uniforms.lightPosition.xyz - vPosition.xyz);     
                const V:vec3<f32> = normalize(uniforms.eyePosition.xyz - vPosition.xyz);          
                const H:vec3<f32> = normalize(L + V);

                var twoSide:i32 = ${this.isTwoSideLighting};
                var diffuse:f32 = ${this.diffuseIntensity} * max(dot(N, L), 0.0);
                if(twoSide == 1){
                    diffuse = diffuse + ${this.diffuseIntensity} * max(dot(-N, L), 0.0);
                } 

                var specular:f32;
                var isp:i32 = ${this.isPhong};
                if(isp == 1){                   
                    specular = ${this.specularIntensity} * pow(max(dot(V, reflect(-L, N)),0.0), ${this.shininess});
                    if(twoSide == 1) {
                    specular = specular + ${this.specularIntensity} * pow(max(dot(V, reflect(-L, -N)),0.0), ${this.shininess});
                    }
                } else {
                    specular = ${this.specularIntensity} * pow(max(dot(N, H),0.0), ${this.shininess});
                    if(twoSide == 1){                     
                    specular = specular + ${this.specularIntensity} * pow(max(dot(-N, H),0.0), ${this.shininess});
                    }
                }               
                const ambient:f32 = ${this.ambientIntensity};               
                const finalColor:vec3<f32> = vColor * (ambient + diffuse) + vec3<f32>${this.specularColor}*specular; 
                fragColor = vec4<f32>(finalColor, 1.0);
                return;
            }`;

        return {vertex, fragment};
    }

    public static glslShaders() {
        const vertex = `
            #version 450
            layout(location=0) in vec4 position;
            layout(location=1) in vec4 normal;
            layout(location=2) in vec3 color;
            
            layout(set=0, binding=0) uniform VertexUniforms {
                mat4 viewProjectionMatrix;
                mat4 modelMatrix;               
                mat4 normalMatrix;
            };

            layout(location=0) out vec4 vPosition;
            layout(location=1) out vec4 vNormal;
            layout(location=2) out vec3 vColor;
            
            void main() {
                vec4 mPosition = modelMatrix * position;
                vPosition = mPosition;                
                vNormal = normalMatrix * normal;     
                vColor = color;                        
                gl_Position = viewProjectionMatrix * mPosition;
            }`;

        const fragment = `
            #version 450    
            layout(location=0) in vec4 vPosition;
            layout(location=1) in vec4 vNormal;
            layout(location=2) in vec3 vColor;
            
            layout(set=0, binding=1) uniform FragmentUniforms {
                vec4 lightPosition;
                vec4 eyePosition;
            };
            layout(location=0) out vec4 fragColor;

            void main() {
                vec3 N = normalize(vNormal.xyz);                
                vec3 L = normalize(lightPosition.xyz - vPosition.xyz);      
                vec3 V = normalize(eyePosition.xyz - vPosition.zyx);          
                vec3 H = normalize(L + V); 
                int twoSide = ${this.isTwoSideLighting};
                float diffuse = ${this.diffuseIntensity} * max(dot(N, L), 0.0); 
                if(twoSide == 1){
                    diffuse += ${this.diffuseIntensity} * max(dot(-N, L), 0.0); 
                }
                int isp = ${this.isPhong};
                float specular;
                if(isp == 1){               
                    specular = ${this.specularIntensity} * pow(max(dot(V, reflect(-L, N)), 0.0), ${this.shininess});
                    if(twoSide == 1){
                    specular += ${this.specularIntensity} * pow(max(dot(V, reflect(-L, -N)), 0.0), ${this.shininess});
                    }
                } else{
                    specular = ${this.specularIntensity} * pow(max(dot(N, H), 0.0), ${this.shininess});
                    if(twoSide == 1){
                        specular += ${this.specularIntensity} * pow(max(dot(-N, H), 0.0), ${this.shininess});
                    }
                }
                vec3 finalColor = vColor * (${this.ambientIntensity} + diffuse) + vec3${this.specularColor}*specular;  
                fragColor = vec4(finalColor, 1.0);
            }`;

         return {vertex, fragment};
    }
}

export class Ch10Shaders {
    public static ambientIntensity: string = '0.2';
    public static diffuseIntensity: string = '0.8';
    public static specularIntensity: string = '0.4';
    public static shininess: string = '30.0';
    public static specularColor: string = '(1.0, 1.0, 1.0)';
    public static isPhong: string = '0';
    public static isTwoSideLighting = '1';

    public static wgslShaders() {
        const vertex = `
            [[block]] struct Uniforms {
                [[offset(0)]] viewProjectionMatrix : mat4x4<f32>;
                [[offset(64)]] modelMatrix : mat4x4<f32>;               
                [[offset(128)]] normalMatrix : mat4x4<f32>;                
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;

            [[location(0)]] var<in> position : vec4<f32>;
            [[location(1)]] var<in> normal : vec4<f32>;
            [[location(2)]] var<in> uv : vec2<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vPosition : vec4<f32>;
            [[location(1)]] var<out> vNormal : vec4<f32>;
            [[location(2)]] var<out> vUV : vec2<f32>;
        
            [[stage(vertex)]]
            fn main() -> void {                
                const mPosition:vec4<f32> = uniforms.modelMatrix * position; 
                vPosition = mPosition;                  
                vNormal =  uniforms.normalMatrix*normal;
                Position = uniforms.viewProjectionMatrix * mPosition;     
                vUV = uv;          
                return;
            }`;

         const fragment = `
            [[block]] struct Uniforms {
                [[offset(0)]] lightPosition : vec4<f32>;   
                [[offset(16)]] eyePosition : vec4<f32>;
            };
            [[binding(1), group(0)]] var<uniform> uniforms : Uniforms;            
            [[binding(2), group(0)]] var textureSampler : sampler;
            [[binding(3), group(0)]] var textureData : texture_2d<f32>;

            [[location(0)]] var<in> vPosition : vec4<f32>;
            [[location(1)]] var<in> vNormal : vec4<f32>;
            [[location(2)]] var<in> vUV : vec2<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;
           
            [[stage(fragment)]]
            fn main() -> void {
                const textureColor:vec3<f32> = (textureSample(textureData, textureSampler, vUV)).rgb;
                const N:vec3<f32> = normalize(vNormal.xyz);                
                const L:vec3<f32> = normalize(uniforms.lightPosition.xyz - vPosition.xyz);     
                const V:vec3<f32> = normalize(uniforms.eyePosition.xyz - vPosition.xyz);          
                const H:vec3<f32> = normalize(L + V);

                var twoSide:i32 = ${this.isTwoSideLighting};
                var diffuse:f32 = ${this.diffuseIntensity} * max(dot(N, L), 0.0);
                if(twoSide == 1){
                    diffuse = diffuse + ${this.diffuseIntensity} * max(dot(-N, L), 0.0);
                } 

                var specular:f32;
                var isp:i32 = ${this.isPhong};
                if(isp == 1){                   
                    specular = ${this.specularIntensity} * pow(max(dot(V, reflect(-L, N)),0.0), ${this.shininess});
                    if(twoSide == 1) {
                       specular = specular + ${this.specularIntensity} * 
                           pow(max(dot(V, reflect(-L, -N)),0.0), ${this.shininess});
                    }
                } else {
                    specular = ${this.specularIntensity} * pow(max(dot(N, H),0.0), ${this.shininess});
                    if(twoSide == 1){                     
                       specular = specular + ${this.specularIntensity} * pow(max(dot(-N, H),0.0), ${this.shininess});
                    }
                }               
                const ambient:f32 = ${this.ambientIntensity};               
                const finalColor:vec3<f32> = textureColor * (ambient + diffuse) + 
                    vec3<f32>${this.specularColor}*specular; 
                fragColor = vec4<f32>(finalColor, 1.0);
                return;
            }`;
        
        return {vertex, fragment};
    }


    public static glslShaders() {
     const vertex = `
        #version 450
        layout(location=0) in vec4 position;
        layout(location=1) in vec4 normal;
        layout(location=2) in vec2 uv;
         
        layout(set=0, binding=0) uniform VertexUniforms {
            mat4 viewProjectionMatrix;
            mat4 modelMatrix;               
            mat4 normalMatrix;
        };

        layout(location=0) out vec4 vPosition;
        layout(location=1) out vec4 vNormal;
        layout(location=2) out vec3 vUV;
        
        void main() {
            vec4 mPosition = modelMatrix * position;
            vPosition = mPosition;                
            vNormal = normalMatrix * normal;     
            vUV = uv;                        
            gl_Position = viewProjectionMatrix * mPosition;
        }`;

     const fragment = `
        #version 450    
        layout(location=0) in vec4 vPosition;
        layout(location=1) in vec4 vNormal;
        layout(location=2) in vec2 vUV;
    
        layout(set=0, binding=1) uniform FragmentUniforms {
            vec4 lightPosition;
            vec4 eyePosition;
        };
        layout(set=0, binding=2) uniform sampler textureSampler;
        layout(set=0, binding=3) uniform texture2D textureData;

        layout(location=0) out vec4 fragColor;

        void main() {
            vec3 textureColor =  texture(sampler2D(textureData, textureSampler), vUV).rgb;

            vec3 N = normalize(vNormal.xyz);                
            vec3 L = normalize(lightPosition.xyz - vPosition.xyz);      
            vec3 V = normalize(eyePosition.xyz - vPosition.zyx);          
            vec3 H = normalize(L + V); 
            int twoSide = ${this.isTwoSideLighting};
            float diffuse = ${this.diffuseIntensity} * max(dot(N, L), 0.0); 
            if(twoSide == 1){
                diffuse += ${this.diffuseIntensity} * max(dot(-N, L), 0.0); 
            }
            int isp = ${this.isPhong};
            float specular;
            if(isp == 1){               
                specular = ${this.specularIntensity} * pow(max(dot(V, reflect(-L, N)), 0.0), ${this.shininess});
                if(twoSide == 1){
                   specular += ${this.specularIntensity} * pow(max(dot(V, reflect(-L, -N)), 0.0), ${this.shininess});
                }
            } else{
                specular = ${this.specularIntensity} * pow(max(dot(N, H), 0.0), ${this.shininess});
                if(twoSide == 1){
                    specular += ${this.specularIntensity} * pow(max(dot(-N, H), 0.0), ${this.shininess});
                }
            }
            vec3 finalColor = textureColor * (${this.ambientIntensity} + diffuse) + vec3${this.specularColor}*specular;  
            fragColor = vec4(finalColor, 1.0);
        }`;

        return {vertex, fragment};
    }
}

export class Ch11Shaders {
    public static ambientIntensity: string = '0.2';
    public static diffuseIntensity: string = '0.8';
    public static specularIntensity: string = '0.4';
    public static shininess: string = '30.0';
    public static specularColor: string = '(1.0, 1.0, 1.0)';
    public static isPhong: string = '0';
    public static isTwoSideLighting = '1';

    public static wgslShaders() {
        const vertex = `
            [[block]] struct Uniforms {
                [[offset(0)]] viewProjectionMatrix : mat4x4<f32>;
                [[offset(64)]] modelMatrix : mat4x4<f32>;               
                [[offset(128)]] normalMatrix : mat4x4<f32>;                
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;

            [[location(0)]] var<in> position : vec4<f32>;
            [[location(1)]] var<in> normal : vec4<f32>;
            [[location(2)]] var<in> uv : vec2<f32>;
            [[location(3)]] var<in> color : vec3<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vPosition : vec4<f32>;
            [[location(1)]] var<out> vNormal : vec4<f32>;
            [[location(2)]] var<out> vUV : vec2<f32>;
            [[location(3)]] var<out> vColor : vec3<f32>;
        
            [[stage(vertex)]]
            fn main() -> void {                
                const mPosition:vec4<f32> = uniforms.modelMatrix * position; 
                vPosition = mPosition;                  
                vNormal =  uniforms.normalMatrix*normal;
                Position = uniforms.viewProjectionMatrix * mPosition;     
                vUV = uv;         
                vColor = color; 
                return;
            }`;

        const fragment = `
            [[block]] struct Uniforms {
                [[offset(0)]] lightPosition : vec4<f32>;   
                [[offset(16)]] eyePosition : vec4<f32>;
            };
            [[binding(1), group(0)]] var<uniform> uniforms : Uniforms;            
            [[binding(2), group(0)]] var textureSampler : sampler;
            [[binding(3), group(0)]] var textureData : texture_2d<f32>;

            [[location(0)]] var<in> vPosition : vec4<f32>;
            [[location(1)]] var<in> vNormal : vec4<f32>;
            [[location(2)]] var<in> vUV : vec2<f32>;
            [[location(3)]] var<in> vColor : vec3<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;
           
            [[stage(fragment)]]
            fn main() -> void {
                const textureColor:vec3<f32> = (textureSample(textureData, textureSampler, vUV)).rgb;
                const N:vec3<f32> = normalize(vNormal.xyz);                
                const L:vec3<f32> = normalize(uniforms.lightPosition.xyz - vPosition.xyz);     
                const V:vec3<f32> = normalize(uniforms.eyePosition.xyz - vPosition.xyz);          
                const H:vec3<f32> = normalize(L + V);

                var twoSide:i32 = ${this.isTwoSideLighting};
                var diffuse:f32 = ${this.diffuseIntensity} * max(dot(N, L), 0.0);
                if(twoSide == 1){
                    diffuse = diffuse + ${this.diffuseIntensity} * max(dot(-N, L), 0.0);
                } 

                var specular:f32;
                var isp:i32 = ${this.isPhong};
                if(isp == 1){                   
                    specular = ${this.specularIntensity} * pow(max(dot(V, reflect(-L, N)),0.0), ${this.shininess});
                    if(twoSide == 1) {
                       specular = specular + ${this.specularIntensity} * pow(max(dot(V, reflect(-L, -N)),0.0), ${this.shininess});
                    }
                } else {
                    specular = ${this.specularIntensity} * pow(max(dot(N, H),0.0), ${this.shininess});
                    if(twoSide == 1){                     
                       specular = specular + ${this.specularIntensity} * pow(max(dot(-N, H),0.0), ${this.shininess});
                    }
                }               
                const ambient:f32 = ${this.ambientIntensity};               
                const finalColor:vec3<f32> = (textureColor + vColor) * (ambient + diffuse) + vec3<f32>${this.specularColor}*specular; 
                fragColor = vec4<f32>(finalColor, 1.0);
                return;
            }`;
        return {vertex, fragment};
    }

    public static glslShaders() {
        const vertex = `
            #version 450
            layout(location=0) in vec4 position;
            layout(location=1) in vec4 normal;
            layout(location=2) in vec2 uv;
            layout(location=3) in vec3 color;
            
            layout(set=0, binding=0) uniform VertexUniforms {
                mat4 viewProjectionMatrix;
                mat4 modelMatrix;               
                mat4 normalMatrix;
            };

            layout(location=0) out vec4 vPosition;
            layout(location=1) out vec4 vNormal;
            layout(location=2) out vec3 vUV;
            layout(location=3) out vec3 vColor;
            
            void main() {
                vec4 mPosition = modelMatrix * position;
                vPosition = mPosition;                
                vNormal = normalMatrix * normal;     
                vUV = uv;      
                vColor = color;                  
                gl_Position = viewProjectionMatrix * mPosition;
            }`;

        const fragment = `
            #version 450    
            layout(location=0) in vec4 vPosition;
            layout(location=1) in vec4 vNormal;
            layout(location=2) in vec2 vUV;
            layout(location=3) in vec3 vColor;
        
            layout(set=0, binding=1) uniform FragmentUniforms {
                vec4 lightPosition;
                vec4 eyePosition;
            };
            layout(set=0, binding=2) uniform sampler textureSampler;
            layout(set=0, binding=3) uniform texture2D textureData;

            layout(location=0) out vec4 fragColor;

            void main() {
                vec3 textureColor =  texture(sampler2D(textureData, textureSampler), vUV).rgb;

                vec3 N = normalize(vNormal.xyz);                
                vec3 L = normalize(lightPosition.xyz - vPosition.xyz);      
                vec3 V = normalize(eyePosition.xyz - vPosition.zyx);          
                vec3 H = normalize(L + V); 
                int twoSide = ${this.isTwoSideLighting};
                float diffuse = ${this.diffuseIntensity} * max(dot(N, L), 0.0); 
                if(twoSide == 1){
                    diffuse += ${this.diffuseIntensity} * max(dot(-N, L), 0.0); 
                }
                int isp = ${this.isPhong};
                float specular;
                if(isp == 1){               
                    specular = ${this.specularIntensity} * pow(max(dot(V, reflect(-L, N)), 0.0), ${this.shininess});
                    if(twoSide == 1){
                    specular += ${this.specularIntensity} * pow(max(dot(V, reflect(-L, -N)), 0.0), ${this.shininess});
                    }
                } else{
                    specular = ${this.specularIntensity} * pow(max(dot(N, H), 0.0), ${this.shininess});
                    if(twoSide == 1){
                        specular += ${this.specularIntensity} * pow(max(dot(-N, H), 0.0), ${this.shininess});
                    }
                }
                vec3 finalColor = (textureColor + vColor) * (${this.ambientIntensity} + diffuse) + vec3${this.specularColor}*specular;  
                fragColor = vec4(finalColor, 1.0);
            }`;

        return {vertex, fragment};
    }
}


export class Ch12Shaders {
    public static wgslShaders() {
        const vertex = `
            [[block]] struct Uniforms {
                [[offset(0)]] viewProjectionMatrix : mat4x4<f32>;
                [[offset(64)]] modelMatrix : mat4x4<f32>;                             
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;

            [[location(0)]] var<in> position : vec4<f32>;
            [[location(1)]] var<in> uv : vec2<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;         
            [[location(0)]] var<out> vUV : vec2<f32>;
        
            [[stage(vertex)]]
            fn main() -> void {                               
                Position = uniforms.viewProjectionMatrix * uniforms.modelMatrix * position;      
                vUV = uv;          
                return;
            }`;

         const fragment = `
            [[binding(1), group(0)]] var textureSampler : sampler;
            [[binding(2), group(0)]] var textureData : texture_2d<f32>;

            [[location(0)]] var<in> vUV : vec2<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;
           
            [[stage(fragment)]]
            fn main() -> void {
                const textureColor:vec3<f32> = (textureSample(textureData, textureSampler, vUV)).rgb;
                fragColor = vec4<f32>(textureColor, 1.0);
                return;
            }`;
        
        return {vertex, fragment};
    }

    public static glslShaders() {
        const vertex = `
            #version 450
            layout(location=0) in vec4 position;
            layout(location=1) in vec2 uv;
            
            layout(set=0, binding=0) uniform VertexUniforms {
                mat4 viewProjectionMatrix;
                mat4 modelMatrix;               
            };
            layout(location=0) out vec3 vUV;
            
            void main() {
                vUV = uv;                        
                gl_Position = viewProjectionMatrix * modelMatrix * position;
            }`;

        const fragment = `
            #version 450    
            layout(location=0) in vec2 vUV;

            layout(set=0, binding=1) uniform sampler textureSampler;
            layout(set=0, binding=2) uniform texture2D textureData;

            layout(location=0) out vec4 fragColor;

            void main() {
                vec3 textureColor =  texture(sampler2D(textureData, textureSampler), vUV).rgb;  
                fragColor = vec4(textureColor, 1.0);
            }`;

            return {vertex, fragment};
    }

    public static wgslShaders1(maxIterations='20', scale = '0.4', cx='0.8', cy='0.1') {
        const vertex = `
            [[block]] struct Uniforms {
                [[offset(0)]] viewProjectionMatrix : mat4x4<f32>;
                [[offset(64)]] modelMatrix : mat4x4<f32>;                             
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;

            [[location(0)]] var<in> position : vec4<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;         
    
            [[stage(vertex)]]
            fn main() -> void {                               
                Position = uniforms.viewProjectionMatrix * uniforms.modelMatrix * position;       
                return;
            }`;

         const fragment = `
            [[location(0)]] var<out> fragColor : vec4<f32>;
            [[builtin(frag_coord)]] var<in> coord_in : vec4<f32>; 

            [[stage(fragment)]]
            fn main() -> void {
                const max:i32 = ${maxIterations};
                const pi:f32 = 3.1415926;
                const scale:f32 = ${scale};
                const cx:f32 = -${cx};
                const cy:f32 = ${cy};
                const n:f32 = 512.0;
                const m:f32 = 512.0;
                var v:f32;
                var x:f32 = coord_in.x/(n*scale) + cx - 1.0 / (2.0*scale);
                var y:f32 = coord_in.y/(m*scale) + cy - 1.0 / (2.0*scale);
                var ax:f32=0.0;
                var ay:f32=0.0;
                var bx:f32;
                var by:f32;

                var i:i32=0;
                loop {
                    if(i >= max) {break;}
                    bx = ax*ax-ay*ay;
                    by = 2.0*ax*ay;
                    ax = bx+x;
                    ay = by+y;
                    v = ax*ax + ay*ay;
                    if(v>4.0) {break;}
                    i=i+1;
                }
                if(v>1.0) {v=1.0;}
                fragColor = vec4<f32>(v, 0.5*(sin(3.0*pi*v)+1.0), 0.5*(cos(3.0*pi*v)+1.0), 1.0);
                return;
            }`;
        
        return {vertex, fragment};
    }

    public static glslShaders1(maxIterations='20', scale = '0.4', cx='-0.8', cy='0.1') {
        const vertex = `
            #version 450
            layout(location=0) in vec4 position;
                
            layout(set=0, binding=0) uniform VertexUniforms {
                mat4 viewProjectionMatrix;
                mat4 modelMatrix;               
            };
                        
            void main() {                      
                gl_Position = viewProjectionMatrix * modelMatrix * position;
            }`;
   
        const fragment = `
            #version 450    
            layout(location=0) out vec4 fragColor;
    
            void main() {
                const int max = ${maxIterations};   
                const float pi = 3.1415926;
                const float scale = ${scale};
                const float cx = ${cx};
                const float cy = ${cy};
                const float m = 512.0;
                const float n = 512.0;
                float v;
                float x = gl_FragCoord.x /(m*scale) + cx - 1.0/(2.0*scale);
                float y = gl_FragCoord.y /(n*scale) + cy - 1.0/(2.0*scale);
                float ax = 0.0;
                float ay = 0.0;
                float bx;
                float by;

                for(int i=0; i<max; i++){
                    bx  = ax*ax-ay*ay;
                    by = 2.0*ax*ay;
                    ax = bx+x;
                    ay = by+y;
                    v = ax*ax+ay*ay;
                    if(v>4.0) break;
                }

                if(v>1.0) v=1.0;
                fragColor = vec4(v, 0.5*(sin(3.0*pi*v)+1.0), 0.5*(cos(3.0*pi*v)+1.0), 1.0);
            }`;
   
           return {vertex, fragment};
       }
   
}

export class Ch13Shaders {
    public static wgslShaders(color = '0.0,0.0,0.0') {
        const vertex = `
            [[block]] struct Uniforms {
                [[offset(0)]] viewProjectionMatrix : mat4x4<f32>;
                [[offset(64)]] modelMatrix : mat4x4<f32>;  
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;
            [[location(0)]] var<in> position : vec4<f32>;            
            [[builtin(position)]] var<out> Position : vec4<f32>;
            
            [[stage(vertex)]]
            fn main() -> void {
                Position = uniforms.viewProjectionMatrix*uniforms.modelMatrix * position;                
                return;
            }`;

        const fragment = `
            [[location(0)]] var<out> outColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
            outColor = vec4<f32>(${color}, 1.0);
            return;
            }`
        return{ vertex, fragment};
    };

    public static glslShaders(color = '0.0,0.0,0.0') {
        const vertex = `
            #version 450
            layout(location=0) in vec4 position;            
            layout(set=0, binding=0) uniform SceneUniforms {
                mat4 viewProjectionMatrix;
                mat4 modelMatrix;
            };           

            void main() {               
                gl_Position =  viewProjectionMatrix*modelMatrix * position;
            }`;

        const fragment = `
            #version 450              
            layout(location=0) out vec4 fragColor;

            void main() {
                fragColor = vec4(${color}, 1.0);
            }`
        return {vertex, fragment};
    };

    public static wgslShadersAxes() {
        const vertex = `
            [[block]] struct Uniforms {
                [[offset(0)]] viewProjectionMatrix : mat4x4<f32>;
                [[offset(64)]] modelMatrix : mat4x4<f32>;  
            };
            [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;
            [[location(0)]] var<in> position : vec4<f32>;      
            [[location(1)]] var<in> color : vec3<f32>;      
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vColor : vec3<f32>;
            
            [[stage(vertex)]]
            fn main() -> void {
                Position = uniforms.viewProjectionMatrix*uniforms.modelMatrix * position;   
                vColor = color;             
                return;
            }`;

        const fragment = `
            [[location(0)]] var<in> vColor : vec3<f32>;
            [[location(0)]] var<out> outColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
            outColor = vec4<f32>(vColor, 1.0);
            return;
            }`
        return{ vertex, fragment};
    };

    public static glslShadersAxes() {
        const vertex = `
            #version 450
            layout(location=0) in vec4 position; 
            layout(location=1) in vec3 color;           
            layout(set=0, binding=0) uniform SceneUniforms {
                mat4 viewProjectionMatrix;
                mat4 modelMatrix;
            };           
            layout(location=0) out vec3 vColor;

            void main() {               
                vColor = color
                gl_Position =  viewProjectionMatrix*modelMatrix * position;
            }`;

        const fragment = `
            #version 450              
            layout(location=0) in vec3 vColor;
            layout(location=0) out vec4 fragColor;

            void main() {
                fragColor = vec4(vColor, 1.0);
            }`
        return {vertex, fragment};
    };
}

export class Ch14Shaders {
    public static wgslShaderCompute = `
      type Arr = [[stride(4)]] array<f32>;
      [[block]] struct DataFormat {
          [[offset(0)]] numbers: Arr;
      };
      [[block]] struct Data{
        [[offset(0)]] angle: f32;
      };

      [[binding(0), group(0)]] var<storage_buffer> pointData: DataFormat;
      [[binding(1), group(0)]] var<uniform> angleData: Data;
      [[binding(2), group(0)]] var<storage_buffer> result: DataFormat;     
      [[builtin(global_invocation_id)]] var<in> GlobalInvocationID : vec3<u32>;
     
      [[stage(compute)]]
      fn main() -> void {
        var index:u32 = GlobalInvocationID.x;        
        var pt:vec2<f32> = normalize(vec2<f32>(pointData.numbers[0], pointData.numbers[1]));
        var p0:f32 = pt[0];
        var p1:f32 = pt[1];
        var theta:f32 = angleData.angle*3.1415926/180.0;
        var res:f32 = 0.0;
        if(index == 0u) { 
          res = p0 * cos(theta) - p1 * sin(theta);
        } else {
          res = p0 * sin(theta) + p1 * cos(theta); 
        }
        result.numbers[index] = res;
      }`;

    public static glslShaderCompute = `#version 450
      layout(set = 0, binding = 0) buffer PointData {
          float numbers[];
      } pointData;
    
      layout(set = 0, binding = 1) uniform AngleData {
          float angle;
      } angleData;
    
      layout(set = 0, binding = 2) buffer Result {
          float numbers[];
      } result;
    
      void main() {
        uint index = gl_GlobalInvocationID.x;
        vec2 pt = normalize(vec2(pointData.numbers[0], pointData.numbers[1]));
        float p0 = pt[0];
        float p1 = pt[1];
        float theta = angleData.angle*3.1415926/180.0;
        float res = 0.0;
        if(index == 0) {
          res = p0 * cos(theta) - p1 * sin(theta);
        } else {
          res = p0 * sin(theta) + p1 * cos(theta);
        }
        
        result.numbers[index] = res;
      }
      `;

    public static wgslShaders(numParticles:number = 2000, colorScale = '0.5') {
        const vertex = `
            [[location(0)]] var<in> a_particlePos : vec2<f32>;
            [[location(1)]] var<in> a_particleVel : vec2<f32>;
            [[location(2)]] var<in> a_pos : vec2<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vVel:vec2<f32>;

            [[stage(vertex)]]
            fn main() -> void {
                var angle : f32 = -atan2(a_particleVel.x, a_particleVel.y);
                var pos : vec2<f32> = vec2<f32>(
                    (a_pos.x * cos(angle)) - (a_pos.y * sin(angle)),
                    (a_pos.x * sin(angle)) + (a_pos.y * cos(angle)));
                Position = vec4<f32>(pos + a_particlePos, 0.0, 1.0);
                vVel = a_particleVel;
                return;
        }`;

        const fragment = `
            [[location(0)]] var<in> vVel: vec2<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;
            [[stage(fragment)]]
            fn main() -> void {
                const pi:f32 = 3.1415926;
                const c:f32 = ${colorScale};
                var vel:f32 = sqrt(vVel.x+vVel.x + vVel.y*vVel.y);
                fragColor = vec4<f32>(c + (1.0-c)*sin(2.0*pi*vel), c + (1.0-c)*sin(pi*vel), c + (1.0-c)*cos(pi*vel), 1.0);
                return;
        }`;
      
        const compute = `
            [[block]] struct Particle {
                [[offset(0)]] pos : vec2<f32>;
                [[offset(8)]] vel : vec2<f32>;
            };
            [[block]] struct SimParams {
                [[offset(0)]] deltaT : f32;
                [[offset(4)]] rule1Distance : f32;
                [[offset(8)]] rule2Distance : f32;
                [[offset(12)]] rule3Distance : f32;
                [[offset(16)]] rule1Scale : f32;
                [[offset(20)]] rule2Scale : f32;
                [[offset(24)]] rule3Scale : f32;
            };
            [[block]] struct Particles {
                [[offset(0)]] particles : [[stride(16)]] array<Particle, ${numParticles}>;
            };
            [[binding(0), group(0)]] var<uniform> params : SimParams;
            [[binding(1), group(0)]] var<storage_buffer> particlesA : Particles;
            [[binding(2), group(0)]] var<storage_buffer> particlesB : Particles;
            [[builtin(global_invocation_id)]] var<in> GlobalInvocationID : vec3<u32>;
            
            [[stage(compute)]]
            fn main() -> void {
                var index : u32 = GlobalInvocationID.x;
                if (index >= ${numParticles}u) {
                return;
                }
                var vPos : vec2<f32> = particlesA.particles[index].pos;
                var vVel : vec2<f32> = particlesA.particles[index].vel;
                var cMass : vec2<f32> = vec2<f32>(0.0, 0.0);
                var cVel : vec2<f32> = vec2<f32>(0.0, 0.0);
                var colVel : vec2<f32> = vec2<f32>(0.0, 0.0);
                var cMassCount : u32 = 0u;
                var cVelCount : u32 = 0u;
                var pos : vec2<f32>;
                var vel : vec2<f32>;
                for (var i : u32 = 0u; i < ${numParticles}u; i = i + 1u) {
                if (i == index) {
                    continue;
                }
                pos = particlesA.particles[i].pos.xy;
                vel = particlesA.particles[i].vel.xy;
                if (distance(pos, vPos) < params.rule1Distance) {
                    cMass = cMass + pos;
                    cMassCount = cMassCount + 1u;
                }
                if (distance(pos, vPos) < params.rule2Distance) {
                    colVel = colVel - (pos - vPos);
                }
                if (distance(pos, vPos) < params.rule3Distance) {
                    cVel = cVel + vel;
                    cVelCount = cVelCount + 1u;
                }
                }
                if (cMassCount > 0u) {
                var temp : f32 = f32(cMassCount);
                cMass = (cMass / vec2<f32>(temp, temp)) - vPos;
                // cMass =
                //  (cMass / vec2<f32>(f32(cMassCount), f32(cMassCount))) - vPos;
                }
                if (cVelCount > 0u) {
                var temp : f32 = f32(cVelCount);
                cVel = cVel / vec2<f32>(temp, temp);
                // cVel = cVel / vec2<f32>(f32(cVelCount), f32(cVelCount));
                }
                vVel = vVel + (cMass * params.rule1Scale) + (colVel * params.rule2Scale) +
                    (cVel * params.rule3Scale);
                // clamp velocity for a more pleasing simulation
                vVel = normalize(vVel) * clamp(length(vVel), 0.0, 0.1);
                // kinematic update
                vPos = vPos + (vVel * params.deltaT);
                // Wrap around boundary
                if (vPos.x < -1.0) {
                vPos.x = 1.0;
                }
                if (vPos.x > 1.0) {
                vPos.x = -1.0;
                }
                if (vPos.y < -1.0) {
                vPos.y = 1.0;
                }
                if (vPos.y > 1.0) {
                vPos.y = -1.0;
                }
                // Write back
                particlesB.particles[index].pos = vPos;
                particlesB.particles[index].vel = vVel;
                return;
        }`;
        return {
            vertex,
            fragment,
            compute
        }
    };

    public static glslShaders (numParticles:number = 2000, colorScale = '0.5') {
        const vertex = `#version 450
            layout(location = 0) in vec2 a_particlePos;
            layout(location = 1) in vec2 a_particleVel;
            layout(location = 2) in vec2 a_pos;
            layout(location = 0) out vec2 vVel;
            void main() {
                float angle = -atan(a_particleVel.x, a_particleVel.y);
                vec2 pos = vec2(a_pos.x * cos(angle) - a_pos.y * sin(angle),
                        a_pos.x * sin(angle) + a_pos.y * cos(angle));
                vVel = a_particleVel;
                gl_Position = vec4(pos + a_particlePos, 0, 1);
            }`;
            
        const fragment = `#version 450
            layout(location = 0) in vec2 vVel;
            layout(location = 0) out vec4 fragColor;
            void main() {
                float pi = 3.1415926;
                float c = ${colorScale};
                float vel = sqrt(vVel.x+vVel.x + vVel.y*vVel.y);
                fragColor = vec4(c + (1.0-c)*sin(2.0*pi*vel), c + (1.0-c)*sin(pi*vel), c + (1.0-c)*cos(pi*vel), 1.0);
            }`;
      
        const compute = `#version 450
            struct Particle {
                vec2 pos;
                vec2 vel;
            };
            layout(std140, set = 0, binding = 0) uniform SimParams {
                float deltaT;
                float rule1Distance;
                float rule2Distance;
                float rule3Distance;
                float rule1Scale;
                float rule2Scale;
                float rule3Scale;
            } params;
            layout(std140, set = 0, binding = 1) buffer ParticlesA {
                Particle particles[${numParticles} /* numParticles */];
            } particlesA;
            layout(std140, set = 0, binding = 2) buffer ParticlesB {
                Particle particles[${numParticles} /* numParticles */];
            } particlesB;
            void main() {
                uint index = gl_GlobalInvocationID.x;
                if (index >= ${numParticles} /* numParticles */) { return; }
                vec2 vPos = particlesA.particles[index].pos;
                vec2 vVel = particlesA.particles[index].vel;
                vec2 cMass = vec2(0.0, 0.0);
                vec2 cVel = vec2(0.0, 0.0);
                vec2 colVel = vec2(0.0, 0.0);
                int cMassCount = 0;
                int cVelCount = 0;
                vec2 pos;
                vec2 vel;
                for (int i = 0; i < ${numParticles} /* numParticles */; ++i) {
                if (i == index) { continue; }
                pos = particlesA.particles[i].pos.xy;
                vel = particlesA.particles[i].vel.xy;
                if (distance(pos, vPos) < params.rule1Distance) {
                    cMass += pos;
                    cMassCount++;
                }
                if (distance(pos, vPos) < params.rule2Distance) {
                    colVel -= (pos - vPos);
                }
                if (distance(pos, vPos) < params.rule3Distance) {
                    cVel += vel;
                    cVelCount++;
                }
                }
                if (cMassCount > 0) {
                cMass = cMass / cMassCount - vPos;
                }
                if (cVelCount > 0) {
                cVel = cVel / cVelCount;
                }
                vVel += cMass * params.rule1Scale + colVel * params.rule2Scale + cVel * params.rule3Scale;
                // clamp velocity for a more pleasing simulation.
                vVel = normalize(vVel) * clamp(length(vVel), 0.0, 0.1);
                // kinematic update
                vPos += vVel * params.deltaT;
                // Wrap around boundary
                if (vPos.x < -1.0) vPos.x = 1.0;
                if (vPos.x > 1.0) vPos.x = -1.0;
                if (vPos.y < -1.0) vPos.y = 1.0;
                if (vPos.y > 1.0) vPos.y = -1.0;
                particlesB.particles[index].pos = vPos;
                // Write back
                particlesB.particles[index].vel = vVel;
        }`;
        return{
            vertex,
            fragment,
            compute
        }
    };

    public static wgslShaders1 (numParticles:number = 50000){
        const vertex = `
            [[block]] struct VertexUniforms {
                [[offset(0)]] screenDimensions : vec2<f32>;
                [[offset(8)]] particleSize : f32;
            };
            [[binding(0), group(0)]] var<uniform> uniforms : VertexUniforms;

            [[location(0)]] var<in> vertexPosition : vec2<f32>;
            [[location(1)]] var<in> color : vec4<f32>;
            [[location(2)]] var<in> position : vec3<f32>;
            [[builtin(position)]] var<out> Position : vec4<f32>;
            [[location(0)]] var<out> vColor : vec4<f32>;

            [[stage(vertex)]]
            fn main() -> void {
                vColor = color;
                Position = vec4<f32>(
                    vertexPosition* uniforms.particleSize / uniforms.screenDimensions + position.xy,
                    position.z,
                    1.0
                );
                return;
            }
        `;

        const fragment = `
            [[location(0)]] var<in> vColor : vec4<f32>;
            [[location(0)]] var<out> fragColor : vec4<f32>;

            [[stage(fragment)]]
            fn main() -> void {
                fragColor = vColor;
                fragColor = vec4<f32>(fragColor.rgb *fragColor.a, fragColor.a);
                return;
            }
        `;
        const compute = `
            [[block]] struct PositionVelocity {
                [[offset(0)]] pv: [[stride(16)]] array<vec4<f32>, ${numParticles}>;
            };
            [[block]] struct Mass {
                [[offset(0)]] mass1Position : vec4<f32>;
                [[offset(16)]] mass2Position : vec4<f32>;
                [[offset(32)]] mass3Position : vec4<f32>;
                [[offset(48)]] mass1Factor : f32;
                [[offset(52)]] mass2Factor : f32;
                [[offset(56)]] mass3Factor : f32;
            };
            [[binding(0), group(0)]] var<storage_buffer> positionIn : PositionVelocity;
            [[binding(1), group(0)]] var<storage_buffer> velocityIn : PositionVelocity;
            [[binding(2), group(0)]] var<storage_buffer> positionOut : PositionVelocity;
            [[binding(3), group(0)]] var<storage_buffer> velocityOut : PositionVelocity;
            [[binding(4), group(0)]] var<uniform> mass : Mass;
            [[builtin(global_invocation_id)]] var<in> GlobalInvocationID : vec3<u32>;

            [[stage(compute)]]
            fn main() -> void {
                var index:u32 =  GlobalInvocationID.x;
                var position:vec3<f32> = positionIn.pv[index].xyz;
                var velocity:vec3<f32> = velocityIn.pv[index].xyz;
                var massVec:vec3<f32> = mass.mass1Position.xyz-position;
                var massDist2:f32 = max(0.01, dot(massVec, massVec));               
                var acceleration:vec3<f32> = mass.mass1Factor/massDist2 * normalize(massVec);
                massVec = mass.mass2Position.xyz-position;
                massDist2 = max(0.01, dot(massVec, massVec));                
                acceleration = acceleration + mass.mass2Factor/massDist2 * normalize(massVec);
                massVec = mass.mass3Position.xyz-position;
                massDist2 = max(0.01, dot(massVec, massVec));               
                acceleration = acceleration + mass.mass3Factor/massDist2 * normalize(massVec);
                velocity = velocity + acceleration;
                velocity = 0.9999 * velocity;               
                positionOut.pv[index] = vec4<f32>(position + velocity, 1.0);               
                velocityOut.pv[index] = vec4<f32>(velocity, 1.0);       
                return;                            
            }
        `;
        return {
            vertex,
            fragment,
            compute
        }

    }
    
    public static glslShaders1 (numParticles:number = 50000) {
        const vertex = `
            #version 450
            layout(location=0) in vec2 vertexPosition;
            layout(location=1) in vec4 color;
            layout(location=2) in vec3 position;
            layout(set=0, binding=0) uniform VertexUniforms {
                vec2 screenDimensions;
                float particleSize;
            };
            layout(location=0) out vec4 vColor;
            
            void main() {
                vColor = color;
                gl_Position = vec4(vertexPosition * particleSize / screenDimensions + position.xy, position.z, 1.0);
            } 
        `;

        const fragment = `
            #version 450            
            layout(location=0) in vec4 vColor;
            layout(location=0) out vec4 fragColor;
            void main() {
                fragColor = vColor;
                fragColor.rgb *= fragColor.a;
            } 
        `;

        const compute = `
            #version 450
            layout(std140, set = 0, binding = 0) buffer PositionsIn {
                vec4 positionsIn[${numParticles}];
            };
            layout(std140, set = 0, binding = 1) buffer VelocityIn {
                vec4 velocityIn[${numParticles}];
            };
            layout(std140, set = 0, binding = 2) buffer PositionsOut {
                vec4 positionsOut[${numParticles}];
            }; 
            layout(std140, set = 0, binding = 3) buffer VelocityOut {
                vec4 velocityOut[${numParticles}];
            }; 
            layout(std140, set = 0, binding = 4) uniform Mass {
                vec4 mass1Position;
                vec4 mass2Position;
                vec4 mass3Position;
                float mass1Factor;
                float mass2Factor;
                float mass3Factor;
            };
            void main() {
                uint index = gl_GlobalInvocationID.x;
                vec3 position = positionsIn[index].xyz;
                vec3 velocity = velocityIn[index].xyz;
                vec3 massVec = mass1Position.xyz - position;
                float massDist2 = max(0.01, dot(massVec, massVec));
                vec3 acceleration = mass1Factor * normalize(massVec) / massDist2;
                massVec = mass2Position.xyz - position;
                massDist2 = max(0.01, dot(massVec, massVec));
                acceleration += mass2Factor * normalize(massVec) / massDist2;
                massVec = mass3Position.xyz - position;
                massDist2 = max(0.01, dot(massVec, massVec));
                acceleration += mass3Factor * normalize(massVec) / massDist2;
                velocity += acceleration;
                velocity *= 0.9999;
                positionsOut[index].xyz = position + velocity;
                velocityOut[index].xyz = velocity;
            }
        `;
        return {
            vertex,
            fragment,
            compute
        }
    }
}