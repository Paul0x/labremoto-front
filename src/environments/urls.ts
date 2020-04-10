export default class URLS {

    constructor() {}
    static env( HOST: string, LOGIN: string, BASE_REF: string) {
        return {
            login:                            HOST + '/login',
            sessaoAtiva:                      HOST + '/laboratorio/sessao'
          };
        }
    }
