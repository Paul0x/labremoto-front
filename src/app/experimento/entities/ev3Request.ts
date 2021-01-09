import { PathInstruction } from "./pathInstruction";
import { ColorCalibration } from "./colorCalibration";

export class Ev3Request {

    matricula: string;
    experimentId: number;
    goalPoints: number[][];
    obstacleSearch: boolean;
    algorithmId: number;
    pidParams: number[];
    colorCalibration: ColorCalibration[];
    pathInstructions: PathInstruction[];

}