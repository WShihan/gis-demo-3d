//  ;
/*
 * @description:下雨效果，参考简书上的代码
 * @date：2022-01-20
 */
export class RainEffect {
  constructor(viewer, options) {
    if (!viewer) throw new Error("no viewer object!");
    options = options || {};
    //倾斜角度，负数向右，正数向左
    this.tiltAngle = Cesium.defaultValue(options.tiltAngle, -0.6);
    this.rainSize = Cesium.defaultValue(options.rainSize, 0.3);
    this.rainSpeed = Cesium.defaultValue(options.rainSpeed, 60.0);
    this.viewer = viewer;
    this.init();
  }

  init() {
    this.rainStage = new Cesium.PostProcessStage({
      name: "czm_rain",
      fragmentShader: this.rain(),
      uniforms: {
        tiltAngle: () => {
          return this.tiltAngle;
        },
        rainSize: () => {
          return this.rainSize;
        },
        rainSpeed: () => {
          return this.rainSpeed;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.rainStage);
  }
  updateStage({ rainAngle, rainSize, rainSpeed }) {
    this.viewer.scene.postProcessStages.remove(this.rainStage);
    this.rainStage = new Cesium.PostProcessStage({
      name: "czm_rain",
      fragmentShader: this.rain(),
      uniforms: {
        tiltAngle: () => {
          return rainAngle;
        },
        rainSize: () => {
          return rainSize;
        },
        rainSpeed: () => {
          return rainSpeed;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.rainStage);
  }

  destroy() {
    if (!this.viewer || !this.rainStage) return;
    this.viewer.scene.postProcessStages.remove(this.rainStage);
    if (!this.rainStage.isDestroyed()) this.rainStage.destroy();
    delete this.tiltAngle;
    delete this.rainSize;
    delete this.rainSpeed;
  }

  show(visible) {
    this.rainStage.enabled = visible;
  }

  rain() {
    return "uniform sampler2D colorTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                uniform float tiltAngle;\n\
                uniform float rainSize;\n\
                uniform float rainSpeed;\n\
                float hash(float x) {\n\
                    return fract(sin(x * 133.3) * 13.13);\n\
                }\n\
                void main(void) {\n\
                    float time = czm_frameNumber / rainSpeed;\n\
                    vec2 resolution = czm_viewport.zw;\n\
                    vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);\n\
                    vec3 c = vec3(.6, .7, .8);\n\
                    float a = tiltAngle;\n\
                    float si = sin(a), co = cos(a);\n\
                    uv *= mat2(co, -si, si, co);\n\
                    uv *= length(uv + vec2(0, 4.9)) * rainSize + 1.;\n\
                    float v = 1. - sin(hash(floor(uv.x * 100.)) * 2.);\n\
                    float b = clamp(abs(sin(20. * time * v + uv.y * (5. / (2. + v)))) - .95, 0., 1.) * 20.;\n\
                    c *= v * b;\n\
                    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c, 1), .5);\n\
                }\n\
                ";
  }
}

// Cesium.RainEffect = RainEffect;
// // 下雨效果
// new Cesium.RainEffect(viewer, {
//     tiltAngle: -0.6, //倾斜角度
//     rainSize: 0.6, // 雨大小
//     rainSpeed: 120.0 // 雨速
// })

/**
 * @description:下雪效果，参考简书代码
 * @date：2022-01-20
 */
export class SnowEffect {
  constructor(viewer, options) {
    if (!viewer) throw new Error("no viewer object!");
    options = options || {};
    this.snowSize = Cesium.defaultValue(options.snowSize, 0.02); //最好小于0.02
    this.snowSpeed = Cesium.defaultValue(options.snowSpeed, 60.0);
    this.viewer = viewer;
    this.init();
  }

  init() {
    this.snowStage = new Cesium.PostProcessStage({
      name: "czm_snow",
      fragmentShader: this.snow(),
      uniforms: {
        snowSize: () => {
          return this.snowSize;
        },
        snowSpeed: () => {
          return this.snowSpeed;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.snowStage);
  }
  updateStage({ snowSize, snowSpeed }) {
    this.viewer.scene.postProcessStages.remove(this.snowStage);
    this.snowStage = new Cesium.PostProcessStage({
      name: "czm_snow",
      fragmentShader: this.snow(),
      uniforms: {
        snowSize: () => {
          return snowSize;
        },
        snowSpeed: () => {
          return snowSpeed;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.snowStage);
  }

  destroy() {
    if (!this.viewer || !this.snowStage) return;
    this.viewer.scene.postProcessStages.remove(this.snowStage);
    if (!this.snowStage.isDestroyed()) this.snowStage.destroy();

    delete this.snowSize;
    delete this.snowSpeed;
  }

  show(visible) {
    this.snowStage.enabled = visible;
  }

  snow() {
    return "uniform sampler2D colorTexture;\n\
            varying vec2 v_textureCoordinates;\n\
            uniform float snowSpeed;\n\
                    uniform float snowSize;\n\
            float snow(vec2 uv,float scale)\n\
            {\n\
                float time=czm_frameNumber/snowSpeed;\n\
                float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
                uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
                uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
                p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
                k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);\n\
                return k*w;\n\
            }\n\
            void main(void){\n\
                vec2 resolution=czm_viewport.zw;\n\
                vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                vec3 finalColor=vec3(0);\n\
                //float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));\n\
                float c=0.;\n\
                c+=snow(uv,30.)*.0;\n\
                c+=snow(uv,20.)*.0;\n\
                c+=snow(uv,15.)*.0;\n\
                c+=snow(uv,10.);\n\
                c+=snow(uv,8.);\n\
                c+=snow(uv,6.);\n\
                c+=snow(uv,5.);\n\
                finalColor=(vec3(c));\n\
                gl_FragColor=mix(texture2D(colorTexture,v_textureCoordinates),vec4(finalColor,1),.5);\n\
                }\n\
                ";
  }
}

// Cesium.SnowEffect = SnowEffect;
// // 下雪效果
// new Cesium.SnowEffect(viewer, {
//     snowSize: 0.02, // 雪花大小
//     snowSpeed: 60.0, // 雪速
// })

/**
 * @description:雾效果，参考简书代码
 * @date：2022-01-20
 */
export class FogEffect {
  constructor(viewer, options) {
    if (!viewer) throw new Error("no viewer object!");
    options = options || {};
    this.visibility = Cesium.defaultValue(options.visibility, 0.1);
    this.color = Cesium.defaultValue(
      options.color,
      new Cesium.Color(0.8, 0.8, 0.8, 0.5)
    );
    this._show = Cesium.defaultValue(options.show, !0);
    this.viewer = viewer;
    this.init();
  }

  init() {
    this.fogStage = new Cesium.PostProcessStage({
      name: "czm_fog",
      fragmentShader: this.fog(),
      uniforms: {
        visibility: () => {
          return this.visibility;
        },
        fogColor: () => {
          return this.color;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.fogStage);
  }
  updateStage({ visibility }) {
    this.viewer.scene.postProcessStages.remove(this.fogStage);
    this.fogStage = new Cesium.PostProcessStage({
      name: "czm_fog",
      fragmentShader: this.fog(),
      uniforms: {
        visibility: () => {
          return visibility;
        },
        fogColor: () => {
          return this.color;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.fogStage);
  }

  destroy() {
    if (!this.viewer || !this.fogStage) return;
    this.viewer.scene.postProcessStages.remove(this.fogStage);
    if (!this.fogStage.isDestroyed()) this.fogStage.destroy();
    delete this.visibility;
    delete this.color;
  }

  show(visible) {
    this._show = visible;
    this.fogState.enabled = this._show;
  }

  fog() {
    return "uniform sampler2D colorTexture;\n\
         uniform sampler2D depthTexture;\n\
         uniform float visibility;\n\
         uniform vec4 fogColor;\n\
         varying vec2 v_textureCoordinates; \n\
         void main(void) \n\
         { \n\
            vec4 origcolor = texture2D(colorTexture, v_textureCoordinates); \n\
            float depth = czm_readDepth(depthTexture, v_textureCoordinates); \n\
            vec4 depthcolor = texture2D(depthTexture, v_textureCoordinates); \n\
            float f = visibility * (depthcolor.r - 0.3) / 0.2; \n\
            if (f < 0.0) f = 0.0; \n\
            else if (f > 1.0) f = 1.0; \n\
            gl_FragColor = mix(origcolor, fogColor, f); \n\
         }\n";
  }
}

// Cesium.FogEffect = FogEffect;
// 雾效果
// new Cesium.FogEffect(viewer, {
//     visibility: 0.0,
//     color: new Cesium.Color(0.8, 0.8, 0.8, 0.3)
// })
