import { MeshStandardMaterialParameters } from "three";

declare module "three" {
  export interface MeshPhysicalMaterialParameters
    extends MeshStandardMaterialParameters {
    thickness?: number;
  }
}
