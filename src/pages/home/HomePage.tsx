import { Header } from "@/widgets/header";
import { Hero } from "@/widgets/hero";
import { TechCarousel } from "@/widgets/tech-carousel";
import { SystemSection } from "@/widgets/system-section";
import { ApproachSwitcher } from "@/widgets/system-section/ApproachSwitcher";
import { ArchitectureCards } from "@/widgets/architecture-cards";
import { Footer } from "@/widgets/footer";
import { BlueprintOverlay } from "@/widgets/blueprint-overlay";
import { ParticleCanvas } from "@/features/particle-network";
import { CursorFollower } from "@/features/cursor-follower";
import { FlowSpecIde } from "@/features/flowspec-ide";
import { FrameworkIde } from "@/features/framework-ide";
import { McuIde } from "@/features/mcu-ide";
import { CliTerminal } from "@/features/cli-terminal";
import {
  downloadFlowSpecPDF,
  downloadSDKRefPDF,
  downloadMCURefPDF,
  downloadCLIRefPDF,
} from "@/shared/lib/pdfGenerator";

const HomePage = () => {
  return (
    <>
      <BlueprintOverlay />
      <ParticleCanvas />

      <div className="page-content">
        <Header />
        <Hero />
        <TechCarousel />

        <SystemSection
          id="systems"
          label="System 01"
          title="Bot Development Platform"
          visual={
            <ApproachSwitcher
              dslContent={<FlowSpecIde />}
              sdkContent={<FrameworkIde />}
            />
          }
        >
          <p className="section-body">
            Build bots with two approaches: a declarative FlowSpec DSL for rapid
            prototyping, or a full TypeScript SDK with middleware pipeline and
            typed event bus. Switch between them seamlessly.
          </p>
          <ul className="section-list">
            <li>FlowSpec DSL: pages, buttons, navigation, hot-reload</li>
            <li>Framework SDK: InlineKeyboard, sessions, lifecycle hooks</li>
            <li>Approach switcher: DSL vs TypeScript SDK</li>
          </ul>
          <div className="doc-downloads">
            <button className="doc-download" onClick={downloadFlowSpecPDF}>
              <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
              FlowSpec DSL Docs
            </button>
            <button className="doc-download" onClick={downloadSDKRefPDF}>
              <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
              SDK Reference
            </button>
          </div>
        </SystemSection>

        <SystemSection
          id="mcu"
          label="System 02"
          title="MCU Emulator"
          visual={<McuIde />}
          reverse
        >
          <p className="section-body">
            Cycle-accurate 8-bit microcontroller emulator with register mapping,
            memory visualization, and I/O simulation. Define hardware specs in a
            custom MCU DSL.
          </p>
          <ul className="section-list">
            <li>Register-level simulation with bit manipulation</li>
            <li>Spec-driven pin configuration and initialization</li>
            <li>Step-through debugging with memory inspector</li>
          </ul>
          <div className="doc-downloads">
            <button className="doc-download" onClick={downloadMCURefPDF}>
              <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
              MCU Reference
            </button>
          </div>
        </SystemSection>

        <SystemSection
          id="cli"
          label="System 03"
          title="CLI Toolchain"
          visual={<CliTerminal />}
        >
          <p className="section-body">
            Unified command-line interface for project scaffolding, DSL
            compilation, deployment management, and MCU firmware operations.
          </p>
          <ul className="section-list">
            <li>Project scaffolding with template system</li>
            <li>DSL compilation with source maps</li>
            <li>Zero-downtime deployments and log streaming</li>
          </ul>
          <div className="doc-downloads">
            <button className="doc-download" onClick={downloadCLIRefPDF}>
              <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
              CLI Reference
            </button>
          </div>
        </SystemSection>

        <ArchitectureCards />

        <div className="section-divider accent-divider"><hr /></div>

        <Footer />
      </div>

      <CursorFollower />
    </>
  );
};

export default HomePage;
