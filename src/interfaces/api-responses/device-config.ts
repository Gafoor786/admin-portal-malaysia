import { ApiBaseResponse, IBase } from "./base";


interface IDevice extends IBase {
    deviceId: string;
    imagePath: string;
    deviceName: string;
    templateId: number;
    description: string;
}

interface ISensorConfig extends IBase {
    sensorConfigId: string;
    unit: string;
    min: string;
    max: string;
    graphType: string;
    icon: string;
}
export type IEnumData = { [key: string]: string }
interface IEvents extends IBase {
    eventId: string;
    name: string;
    mappingKey: string;
    enumList: string;
    deviceId: string;

}

interface ISensor extends IBase {
    sensorId: string;
    sensorName: string;
    mappingKey: string;
    priority: number;
    dashboard: boolean;
}

export interface FinalSensor extends IDevice, ISensor, ISensorConfig {
    chartHeight?: number
}
export interface FinalEvents extends IDevice, IEvents { }

export interface DeviceConfig extends IDevice {
    sensors: FinalSensor[]
    events: FinalEvents[]
}


export interface DeviceConfigResponse extends ApiBaseResponse<DeviceConfig> {

}