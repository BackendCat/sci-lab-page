export const DEFAULT_CODE = `bot "SciBot" {
  page start {
    text "Welcome to SCI-LAB"
    text "Choose a system to explore:"
    button "FlowSpec Engine" -> flowspec
    button "MCU Emulator" -> mcu
    button "Workspace" -> workspace
  }

  page flowspec {
    text "FlowSpec v3.2.1"
    text "DSL-driven bot infrastructure"
    text "Compiler + Runtime + Hot-reload"
    button "Deploy Now" -> deploy
    button "Back" -> start
  }

  page mcu {
    text "MCU Emulator Core"
    text "Cycle-accurate register simulation"
    button "Run Emulator" -> deploy
    button "Back" -> start
  }

  page workspace {
    text "Distributed Workspace v2.0"
    text "CRDT sync + Event sourcing"
    button "Open Workspace" -> deploy
    button "Back" -> start
  }

  page deploy {
    text "Deploying to staging..."
    text "Worker pool: 4 instances"
    text "Status: healthy"
    button "Restart" -> start
  }
}`;
