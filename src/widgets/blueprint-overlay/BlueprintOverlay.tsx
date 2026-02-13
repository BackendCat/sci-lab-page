import styles from "./BlueprintOverlay.module.css";
import { DomainModel } from "./ui/diagrams/DomainModel";
import { ErDiagram } from "./ui/diagrams/ErDiagram";
import { SequenceDiagram } from "./ui/diagrams/SequenceDiagram";
import { ComponentDiagram } from "./ui/diagrams/ComponentDiagram";
import { ApiEndpoints } from "./ui/diagrams/ApiEndpoints";
import { McuRegisterArch } from "./ui/diagrams/McuRegisterArch";
import { CliReference } from "./ui/diagrams/CliReference";
import { SessionFsm } from "./ui/diagrams/SessionFsm";
import { CiCdPipeline } from "./ui/diagrams/CiCdPipeline";
import { ChipPinout } from "./ui/diagrams/ChipPinout";
import { RegisterMap } from "./ui/diagrams/RegisterMap";
import { UseCaseDiagram } from "./ui/diagrams/UseCaseDiagram";
import { BotViewFsm } from "./ui/diagrams/BotViewFsm";
import { TelegramProtocol } from "./ui/diagrams/TelegramProtocol";
import { SdkDependencies } from "./ui/diagrams/SdkDependencies";
import { DeployTopology } from "./ui/diagrams/DeployTopology";
import { WebhookEvents } from "./ui/diagrams/WebhookEvents";
import { ErrorCodes } from "./ui/diagrams/ErrorCodes";

export const BlueprintOverlay = () => (
  <div className={styles.overlay}>
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <DomainModel />
      <ErDiagram />
      <SequenceDiagram />
      <ComponentDiagram />
      <ApiEndpoints />
      <McuRegisterArch />
      <CliReference />
      <SessionFsm />
      <CiCdPipeline />
      <ChipPinout />
      <RegisterMap />
      <UseCaseDiagram />
      <BotViewFsm />
      <TelegramProtocol />
      <SdkDependencies />
      <DeployTopology />
      <WebhookEvents />
      <ErrorCodes />
    </svg>
  </div>
);
