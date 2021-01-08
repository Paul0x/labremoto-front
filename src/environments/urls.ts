export default class URLS {

    constructor() {}
    static env( HOST: string, LOGIN: string, BASE_REF: string, FLASK_REF: string) {
        return {
            login:                            HOST + '/login',
            sessaoAtiva:                      HOST + '/laboratorio/sessao-ativa',
            startSession:                     HOST + '/laboratorio/sessao',
            cameraImg:                        FLASK_REF + '/static/imgVideo.jpg'
          };
        }
    }
