import "bootstrap";

export class NavBar{
    public static CheckWebGPU() : string{
        let result = 'Your current browser supports WebGPU!';
        if (!navigator.gpu) {
           result = `Your current browser does not support WebGPU! Make sure you are on a system 
                     with WebGPU enabled. Currently, SPIR-WebGPU is only supported in  
                     <a href="https://www.google.com/chrome/canary/">Chrome canary</a>
                     with the flag "enable-unsafe-webgpu" enabled. See the 
                     <a href="https://github.com/gpuweb/gpuweb/wiki/Implementation-Status"> 
                     Implementation Status</a> page for more details.                   
                    `;
        } 
        return result;
    }

    public static AddNavbar() {
        const navbar = `
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="/index.html">WebGPU Project</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
            
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="/index.html">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/html/test.html">Test</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Chapter 2-4
                        </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="/html/ch02-triangle.html">Ch02: Triangle </a>
                        <a class="dropdown-item" href="/html/ch02-triangle-glsl.html">Ch02: GLSL Triangle</a> 
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="/html/ch03-points.html">Ch03: Points </a>
                        <a class="dropdown-item" href="/html/ch03-lines.html">Ch03: Lines</a>      
                        <a class="dropdown-item" href="/html/ch03-triangles.html">Ch03: Triangles</a>   
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="/html/ch04-triangle-color.html">Ch04: Colored Triangle </a>
                        <a class="dropdown-item" href="/html/ch04-triangle-one-buffer.html">Ch04: Triangle: One Buffer</a>      
                        <a class="dropdown-item" href="/html/ch04-square.html">Ch04: Square</a>   
                        <a class="dropdown-item" href="/html/ch04-square-index.html">Ch04: Square with Index Buffer</a>      
                    </div>
                    </li>   
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Chapter 5-7
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="/html/ch05-transforms.html">Ch05: Transformations</a>
                            <a class="dropdown-item" href="/html/ch05-projection.html">Ch05: Projection</a>   
                            <div class="dropdown-divider"></div> 

                            <a class="dropdown-item" href="/html/ch06-line.html">Ch06: 3D Line</a>
                            <a class="dropdown-item" href="/html/ch06-cube.html">Ch06: Cube: Face Color</a>
                            <a class="dropdown-item" href="/html/ch06-cube-vertex-color.html">Ch06: Cube: Vertex Color</a>     
                            <div class="dropdown-divider"></div>
                            
                            <a class="dropdown-item" href="/html/ch07-cube.html">Ch07: Cube Wireframe</a>   
                            <a class="dropdown-item" href="/html/ch07-sphere.html">Ch07: Sphere Wireframe</a> 
                            <a class="dropdown-item" href="/html/ch07-cylinder.html">Ch07: Cylinder Wireframe</a> 
                            <a class="dropdown-item" href="/html/ch07-cone.html">Ch07: Cone Wireframe</a>    
                            <a class="dropdown-item" href="/html/ch07-torus.html">Ch07: Torus Wireframe</a>                                            
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Chapter 8-10
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="/html/ch08-cube.html">Ch08: Cube with Lighting</a>
                            <a class="dropdown-item" href="/html/ch08-sphere.html">Ch08: Sphere with Lighting</a>   
                            <a class="dropdown-item" href="/html/ch08-cylinder.html">Ch08: Cylinder with Lighting</a>   
                            <a class="dropdown-item" href="/html/ch08-cone.html">Ch08: Cone with Lighting</a>   
                            <a class="dropdown-item" href="/html/ch08-torus.html">Ch08: Torus with Lighting</a>     

                            <div class="dropdown-divider"></div>                     
                            <a class="dropdown-item" href="/html/ch09-sinc.html">Ch09: Sinc Surface</a>
                            <a class="dropdown-item" href="/html/ch09-exp.html">Ch09: Exponential Surface</a>
                            <a class="dropdown-item" href="/html/ch09-peak.html">Ch09: Peaks Surface</a>
                            <a class="dropdown-item" href="/html/ch09-helicoid.html">Ch09: Helicoid Surface</a>
                            <a class="dropdown-item" href="/html/ch09-klein-bottle.html">Ch09: Klein Bottle</a>
                            <a class="dropdown-item" href="/html/ch09-wellenkugel.html">Ch09: Wellenkugel Surface</a>
                            <a class="dropdown-item" href="/html/ch09-radial-wave.html">Ch09: Radial Wave Surface</a>

                            <div class="dropdown-divider"></div>     
                            <a class="dropdown-item" href="/html/ch10-cube.html">Ch10: Cube with Texture</a>   
                            <a class="dropdown-item" href="/html/ch10-sphere.html">Ch10: Sphere with Texture</a>  
                            <a class="dropdown-item" href="/html/ch10-cylinder.html">Ch10: Cylinder with Texture</a>    
                            <a class="dropdown-item" href="/html/ch10-sinc.html">Ch10: Sinc Surface with Texture</a>    
                            <a class="dropdown-item" href="/html/ch10-peak.html">Ch10: Peaks Surface with Texture</a> 
                            <a class="dropdown-item" href="/html/ch10-klein-bottle.html">Ch10: Klein Bottle with Texture</a>    
                            <a class="dropdown-item" href="/html/ch10-wellenkugel.html">Ch10: Wellenkugel Surface with Texture</a> 
                            <a class="dropdown-item" href="/html/ch10-cube-multiple.html">Ch10: Cube with multiple Textures</a>   
                        </div>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Chapter 11-13
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="/html/ch11-sinc.html">Ch11: Sinc Chart</a>
                            <a class="dropdown-item" href="/html/ch11-exp.html">Ch1: Exponential Chart</a>  
                            <a class="dropdown-item" href="/html/ch11-peak.html">Ch1: Peaks Chart</a>   
                            <a class="dropdown-item" href="/html/ch11-sphere.html">Ch11: Sphere</a>   
                            <a class="dropdown-item" href="/html/ch11-torus.html">Ch11: Torus</a>   
                            <a class="dropdown-item" href="/html/ch11-klein-bottle.html">Ch11: Klein Bottle</a>   
                            <a class="dropdown-item" href="/html/ch11-wellenkugel.html">Ch11: Wellenkugel Chart</a>     

                            <div class="dropdown-divider"></div>                     
                            <a class="dropdown-item" href="/html/ch12-complex3d.html">Ch12: Complex 3D Surface</a>
                            <a class="dropdown-item" href="/html/ch12-animate-vertex.html">Ch12: Animate Vertex</a>
                            <a class="dropdown-item" href="/html/ch12-fractal.html">Ch12: Fractal</a>    
                            <a class="dropdown-item" href="/html/ch12-fractal-shader.html">Ch12: Fractal from Shader</a>   

                            <div class="dropdown-divider"></div>              
                            <a class="dropdown-item" href="/html/ch13-two-objects.html">Ch13: Two Objects</a>       
                            <a class="dropdown-item" href="/html/ch13-multiple.html">Ch13: Multiple Objects</a>
                            <a class="dropdown-item" href="/html/ch13-pipelines.html">Ch13: Two Pipelines</a>
                            <a class="dropdown-item" href="/html/ch13-pipelines-chart.html">Ch13: Surface Chart</a>
                            <a class="dropdown-item" href="/html/ch13-chart-axes.html">Ch13: Surface Chart with Axes</a>
                        </div>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Chapter 14
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="/html/ch14-compute.html">Ch14: Test Compute Shader</a>
                            <a class="dropdown-item" href="/html/ch14-compute-boids.html">Ch14: Compute Boids</a>
                            <a class="dropdown-item" href="/html/ch14-particles.html">Ch14: Particles</a>

                            <div class="dropdown-divider"></div>                     
                           
                        </div>
                    </li>
                </ul>               
                </div>
            </nav>
        `
        const div = document.getElementById('id_navbar') as HTMLDivElement;
        div.innerHTML = navbar;
    }
}
