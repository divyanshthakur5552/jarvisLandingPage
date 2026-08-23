import { WorkflowNode, WorkflowEdge, PresetScenario } from '../types/workflow';

export const INITIAL_NODES: WorkflowNode[] = [
  // 1. TRIGGER NODE (Leftmost capsule)
  {
    id: 'node-trigger',
    type: 'trigger',
    category: 'trigger',
    title: 'Command received',
    iconName: 'Terminal',
    x: 60,
    y: 304,
    width: 140,
    height: 56,
    state: 'idle',
    details: {
      plane: 'Trigger Ingress',
      planeColor: '#2dd4bf',
      description: 'Ingests voice or text prompt from user terminal, WebSocket client, or system hotkey listener.',
      latencyMs: 14,
      techStack: 'WebSocket / gRPC Ingress Stream',
      inputPayload: {
        source: 'local_mic_or_cli',
        rawText: 'Create a Python script and test execution',
        mode: 'multi_plane_agent',
        clientTimestamp: '2026-08-22T01:54:41.102Z'
      },
      outputPayload: {
        normalizedPrompt: 'Create a Python script and test execution',
        contextId: 'ctx-jarvis-9482',
        sessionToken: 'sess_live_plane_09a'
      },
      executionLog: [
        'Captured input payload stream from client hotkey trigger.',
        'Sanitized input text & generated deterministic correlation ID.',
        'Dispatched to Neural Control Plane (Planner Agent).'
      ],
      documentation: 'Trigger gateway entry point for multi-plane automation. Listens for user intent across CLI, voice transcription streams, and hotkeys.'
    }
  },

  // 2. MAIN PROCESS NODE: Planner Agent (Hub)
  {
    id: 'node-planner',
    type: 'main_process',
    category: 'planner',
    title: 'Planner agent',
    subtitle: 'Gemini Flash Lite',
    iconName: 'Bot',
    x: 260,
    y: 292,
    width: 220,
    height: 80,
    state: 'idle',
    diamondConnectors: [
      { id: 'diamond-0', label: 'Model', subNodeId: 'sub-model' },
      { id: 'diamond-1', label: 'Memory', subNodeId: 'sub-memory' },
      { id: 'diamond-2', label: 'Tools', subNodeId: 'sub-tools' }
    ],
    details: {
      plane: 'Neural Control Plane',
      planeColor: '#8b5cf6',
      description: 'Orchestrates the plan breakdown, selects between Direct Execution or Vision Pipeline paths, and injects context.',
      latencyMs: 185,
      techStack: 'Gemini Flash Lite + Fast Decision Engine',
      inputPayload: {
        prompt: 'Create a Python script and test execution',
        availablePlanes: ['direct_system_plane', 'vision_action_plane'],
        activeWindow: 'VS Code - terminal',
        os: 'darwin_arm64 / linux_x64'
      },
      outputPayload: {
        planId: 'plan_exec_7721',
        requiresVision: false,
        estimatedSteps: 3,
        suggestedStrategy: 'direct_execution_plane',
        confidenceScore: 0.982
      },
      executionLog: [
        'Connected to Gemini Flash Lite sub-model socket.',
        'Loaded recent context from Session Memory (window context: Code Editor).',
        'Queried Step Type Library (25+ step definitions loaded).',
        'Formulated multi-step execution plan with zero GUI ambiguity.'
      ],
      documentation: 'Core orchestration engine. Deconstructs ambiguous natural language intents into deterministic DAG steps with structured fallback semantics.'
    }
  },

  // 2a. SUB-NODE: Gemini Flash Lite (Model)
  {
    id: 'sub-model',
    type: 'sub_node',
    category: 'planner',
    title: 'Gemini Flash Lite',
    subtitle: 'chat model',
    iconName: 'Sparkles',
    x: 200,
    y: 470,
    width: 64,
    height: 64,
    state: 'idle',
    parentHubId: 'node-planner',
    diamondIndex: 0,
    details: {
      plane: 'Neural Control Plane',
      planeColor: '#8b5cf6',
      description: 'High-speed reasoning model generating structured JSON plans with latency under 200ms.',
      latencyMs: 142,
      techStack: 'Google Gemini Flash Lite SDK',
      inputPayload: {
        model: 'gemini-flash-lite',
        temperature: 0.1,
        response_schema: 'PlanDAGSchema'
      },
      outputPayload: {
        tokensGenerated: 164,
        tps: 115.4,
        structuredPlan: 'VALID_JSON'
      },
      executionLog: [
        'Invoked structured plan schema validation.',
        'Completed token generation in 142ms.'
      ],
      documentation: 'Configured LLM inference backend tuned for lightning-fast action planning and strict JSON-schema compliance.'
    }
  },

  // 2b. SUB-NODE: Session Memory
  {
    id: 'sub-memory',
    type: 'sub_node',
    category: 'memory',
    title: 'Session memory',
    subtitle: 'conversation ctx',
    iconName: 'Database',
    x: 300,
    y: 470,
    width: 64,
    height: 64,
    state: 'idle',
    parentHubId: 'node-planner',
    diamondIndex: 1,
    details: {
      plane: 'Neural Control Plane',
      planeColor: '#3b82f6',
      description: 'Maintains short-term window states, user preferences, active working directory, and conversation threads.',
      latencyMs: 12,
      techStack: 'In-Memory Sliding Window Buffer + Vector Ring',
      inputPayload: {
        query: 'recent_active_context',
        maxTokens: 4096
      },
      outputPayload: {
        cwd: '/Users/developer/project',
        lastFocusedApp: 'Visual Studio Code',
        activeBranch: 'main'
      },
      executionLog: [
        'Retrieved active shell state and workspace metadata.',
        'Injected environment variables into planner prompt.'
      ],
      documentation: 'Low-latency working memory cache providing dynamic context regarding current desktop focus and working paths.'
    }
  },

  // 2c. SUB-NODE: Step Type Library
  {
    id: 'sub-tools',
    type: 'sub_node',
    category: 'planner',
    title: 'Step type library',
    subtitle: '25+ step defs',
    iconName: 'Library',
    x: 400,
    y: 470,
    width: 64,
    height: 64,
    state: 'idle',
    parentHubId: 'node-planner',
    diamondIndex: 2,
    details: {
      plane: 'Neural Control Plane',
      planeColor: '#8b5cf6',
      description: 'Extensible registry of predefined, typed atomic step primitives across shell, filesystem, keyboard, and OS vision.',
      latencyMs: 8,
      techStack: 'TypeScript Schema Registry',
      inputPayload: {
        filter: 'all_available_primitives'
      },
      outputPayload: {
        totalSteps: 28,
        categories: ['direct_io', 'system_shell', 'gui_automation', 'vision_som']
      },
      executionLog: [
        'Loaded schema tools definitions for function calling.',
        'Validated argument signatures against system capabilities.'
      ],
      documentation: 'Standard library of deterministic atomic actions exposed to the Planner Agent with strict type definitions.'
    }
  },

  // 3. DECISION NODE 1: Needs screen vision?
  {
    id: 'node-decision-vision',
    type: 'decision',
    category: 'decision',
    title: 'Needs screen vision?',
    iconName: 'GitFork',
    x: 550,
    y: 292,
    width: 170,
    height: 80,
    state: 'idle',
    details: {
      plane: 'Neural Control Plane',
      planeColor: '#22c55e',
      description: 'Evaluates if the planned action requires visual grounding (GUI mouse clicks/element OCR) or can run directly via shell/files.',
      latencyMs: 16,
      techStack: 'Deterministic Heuristic + LLM Branch Selector',
      inputPayload: {
        planSteps: ['create_file', 'shell_exec'],
        hasNonApiGuiTarget: false
      },
      outputPayload: {
        decision: 'branch_false',
        reason: 'All requested operations have direct CLI & FileSystem APIs.',
        selectedBranch: 'Direct Execution Cluster'
      },
      executionLog: [
        'Analyzed step targets against OS accessibility tree.',
        'Branch routing: FALSE → Direct Execution Plane.',
        'Saved 95% latency by bypassing unnecessary vision capture.'
      ],
      documentation: 'Branch router that bifurcates execution between lightweight, instant direct system calls and heavy visual perception pipelines.'
    }
  },

  // --- FALSE BRANCH: DIRECT EXECUTION CLUSTER (Amber) ---

  // 4a. Action: Shell command
  {
    id: 'node-action-shell',
    type: 'action',
    category: 'direct_exec',
    title: 'Shell command',
    subtitle: 'mkdir, start, del',
    iconName: 'Terminal',
    x: 790,
    y: 140,
    width: 180,
    height: 76,
    state: 'idle',
    details: {
      plane: 'Direct System Plane',
      planeColor: '#f59e0b',
      description: 'Executes sandboxed bash/zsh shell processes with streaming stdout/stderr monitoring.',
      latencyMs: 48,
      techStack: 'Native PTY Subprocess Manager',
      inputPayload: {
        command: 'mkdir -p ./scripts && touch ./scripts/app.py',
        cwd: '/Users/developer/project',
        timeoutMs: 5000
      },
      outputPayload: {
        exitCode: 0,
        stdout: '',
        durationMs: 42
      },
      executionLog: [
        'Spawned async subprocess session in root directory.',
        'Created target directories with 0 exit code.',
        'Piped stderr stream to background monitor.'
      ],
      documentation: 'Fast direct shell execution pipeline running with native permissions without GUI overhead.'
    }
  },

  // 4b. Action: File operation
  {
    id: 'node-action-file',
    type: 'action',
    category: 'direct_exec',
    title: 'File operation',
    subtitle: 'write_file, read_file',
    iconName: 'FileCode',
    x: 1020,
    y: 140,
    width: 180,
    height: 76,
    state: 'idle',
    details: {
      plane: 'Direct System Plane',
      planeColor: '#f59e0b',
      description: 'Performs atomic file creation, code generation, parsing, or binary streaming.',
      latencyMs: 64,
      techStack: 'Node FS / Async I/O Stream',
      inputPayload: {
        filePath: './scripts/app.py',
        operation: 'write_atomic',
        contentSnippet: 'import sys\nprint("JARVIS execution verified!")'
      },
      outputPayload: {
        bytesWritten: 58,
        checksum: 'sha256:7a9f...3e',
        status: 'SUCCESS'
      },
      executionLog: [
        'Constructed code block from Planner agent output.',
        'Performed atomic write to disk with lock verification.',
        'Synced filesystem cache.'
      ],
      documentation: 'Safe, transactional filesystem modifications with automated diffing and rollback support.'
    }
  },

  // 4c. Action: Keyboard action
  {
    id: 'node-action-keyboard',
    type: 'action',
    category: 'direct_exec',
    title: 'Keyboard action',
    subtitle: 'ctrl+s, ctrl+`',
    iconName: 'Keyboard',
    x: 1250,
    y: 140,
    width: 180,
    height: 76,
    state: 'idle',
    details: {
      plane: 'Direct System Plane',
      planeColor: '#f59e0b',
      description: 'Sends low-level OS keystrokes, editor hotkeys, or terminal toggle signals directly.',
      latencyMs: 32,
      techStack: 'Native OS Event Synthesizer (CoreGraphics/X11)',
      inputPayload: {
        keys: ['Ctrl', 'Shift', 'P'],
        modifierDelayMs: 25
      },
      outputPayload: {
        eventStatus: 'dispatched',
        acknowledgedByOS: true
      },
      executionLog: [
        'Dispatched keyboard chord to active foreground window.',
        'Verified keystroke buffer cleared.'
      ],
      documentation: 'Synthetic input event driver for triggering application hotkeys and terminal shortcuts directly.'
    }
  },

  // --- TRUE BRANCH: VISION PIPELINE CLUSTER (Coral) ---

  // 5a. Action: Screenshot capture
  {
    id: 'node-action-screenshot',
    type: 'action',
    category: 'vision',
    title: 'Screenshot capture',
    subtitle: 'full desktop frame',
    iconName: 'Camera',
    x: 790,
    y: 440,
    width: 180,
    height: 76,
    state: 'idle',
    details: {
      plane: 'Vision Action Plane',
      planeColor: '#f97362',
      description: 'High-speed frame grab of all active monitors with DPI scaling and sub-region cropping.',
      latencyMs: 85,
      techStack: 'DirectX / Metal Display Capture API',
      inputPayload: {
        displayIndex: 0,
        resolution: '2560x1440',
        compression: 'webp_lossless'
      },
      outputPayload: {
        frameId: 'frame_88192',
        width: 2560,
        height: 1440,
        byteSize: '1.4MB'
      },
      executionLog: [
        'Captured hardware display surface buffer.',
        'Applied retina DPI coordinate normalization.',
        'Piped lossless bitmap to OmniParser detection service.'
      ],
      documentation: 'Captures desktop screen state at native display resolutions with minimal system latency.'
    }
  },

  // 5b. Action: OmniParser detection
  {
    id: 'node-action-omniparser',
    type: 'action',
    category: 'vision',
    title: 'OmniParser detection',
    subtitle: 'SoM element boxes',
    iconName: 'ScanEye',
    x: 1020,
    y: 440,
    width: 180,
    height: 76,
    state: 'idle',
    details: {
      plane: 'Vision Action Plane',
      planeColor: '#f97362',
      description: 'Detects interactive UI elements (buttons, inputs, icons) and assigns numeric Set-of-Mark (SoM) bounding boxes.',
      latencyMs: 240,
      techStack: 'OmniParser V2 Object Detection + OCR',
      inputPayload: {
        frameId: 'frame_88192',
        confidenceThreshold: 0.65
      },
      outputPayload: {
        elementsDetected: 34,
        markedImageId: 'som_annotated_frame_88192',
        labels: ['URL bar [ID: 3]', 'Search button [ID: 7]', 'Tab [ID: 1]']
      },
      executionLog: [
        'Identified 34 interactive UI contours on screen.',
        'Labeled bounding boxes with high-contrast SoM markers.',
        'Prepared visual prompt payload for Gemini 2.5 Flash.'
      ],
      documentation: 'State-of-the-art vision parser transforming raw desktop pixels into discrete, indexed interactable elements.'
    }
  },

  // 5c. Action: Vision mapper
  {
    id: 'node-action-mapper',
    type: 'action',
    category: 'vision',
    title: 'Vision mapper',
    subtitle: 'Gemini 2.5 Flash',
    iconName: 'Eye',
    x: 1250,
    y: 440,
    width: 180,
    height: 76,
    state: 'idle',
    details: {
      plane: 'Vision Action Plane',
      planeColor: '#f97362',
      description: 'Grounds natural language intent against the SoM tagged screenshot to select the exact target coordinate.',
      latencyMs: 290,
      techStack: 'Gemini 2.5 Flash Multimodal Vision Model',
      inputPayload: {
        intent: 'Click the Chrome address bar and navigate to youtube.com',
        annotatedImage: 'som_annotated_frame_88192'
      },
      outputPayload: {
        selectedElementId: 3,
        elementDescription: 'Chrome Omnibox address input',
        targetCoordinates: { x: 540, y: 82 },
        actionType: 'click_and_type'
      },
      executionLog: [
        'Multimodal grounding completed.',
        'Selected element #3 (URL bar) with 99.4% confidence.',
        'Calculated absolute center click coordinates (540, 82).'
      ],
      documentation: 'Multimodal reasoning agent that matches UI semantics to the desired next action with extreme spatial accuracy.'
    }
  },

  // 5d. Action: Click coordinates
  {
    id: 'node-action-click',
    type: 'action',
    category: 'vision',
    title: 'Click coordinates',
    subtitle: 'pyautogui click',
    iconName: 'MousePointer',
    x: 1480,
    y: 440,
    width: 180,
    height: 76,
    state: 'idle',
    details: {
      plane: 'Vision Action Plane',
      planeColor: '#f97362',
      description: 'Executes physical cursor translation, click events, and key sequence typing on the target element.',
      latencyMs: 95,
      techStack: 'PyAutoGUI / Low-Level Input Driver',
      inputPayload: {
        action: 'left_click',
        coordinates: { x: 540, y: 82 },
        typeString: 'https://youtube.com\n'
      },
      outputPayload: {
        cursorMoved: true,
        clickDispatched: true,
        textInjected: 'https://youtube.com'
      },
      executionLog: [
        'Smooth cursor trajectory animated to (540, 82).',
        'Dispatched hardware mouse down & mouse up event.',
        'Sent URL string and Enter key stroke.'
      ],
      documentation: 'Hardware-level input emulator that interacts with unscriptable GUI applications naturally.'
    }
  },

  // 6. DECISION NODE 2: Verification
  {
    id: 'node-decision-verify',
    type: 'decision',
    category: 'decision',
    title: 'Verification',
    iconName: 'CheckCircle2',
    x: 1730,
    y: 292,
    width: 160,
    height: 80,
    state: 'idle',
    details: {
      plane: 'Verification & State Plane',
      planeColor: '#22c55e',
      description: 'Validates task outcome by inspecting exit codes, new file existence, or changed screen pixels against success criteria.',
      latencyMs: 52,
      techStack: 'Deterministic Assertion Engine',
      inputPayload: {
        targetRule: 'file_exists_and_executed_cleanly',
        timeoutLimit: '3000ms'
      },
      outputPayload: {
        isSuccess: true,
        verifiedState: 'PASS',
        retryCount: 0
      },
      executionLog: [
        'Checked target artifact existence & return status.',
        'All execution assertions passed 100%.',
        'Routing to Terminal Complete.'
      ],
      documentation: 'Feedback loop validator. If expectations fail, triggers automated retry or switches planes dynamically.'
    }
  },

  // 7. TERMINAL NODE: Task complete
  {
    id: 'node-terminal-complete',
    type: 'terminal',
    category: 'verification',
    title: 'Task complete',
    subtitle: 'All steps verified',
    iconName: 'Check',
    x: 1960,
    y: 292,
    width: 180,
    height: 76,
    state: 'idle',
    details: {
      plane: 'Verification & State Plane',
      planeColor: '#10b981',
      description: 'Final execution milestone. Broadcasts success event to user terminal, voice synthesis, or mobile companion.',
      latencyMs: 10,
      techStack: 'JARVIS Notification Bus',
      inputPayload: {
        totalDurationMs: 389,
        stepsExecuted: 4,
        status: 'SUCCESS'
      },
      outputPayload: {
        userNotification: 'Task executed successfully in 389ms.',
        mobilePushSent: true
      },
      executionLog: [
        'Recorded trace in execution ledger.',
        'Sent audio confirmation chime to local speakers.',
        'Pipeline completed in 389ms.'
      ],
      documentation: 'Terminal sink node indicating completed workflow with end-to-end multi-plane validation.'
    }
  }
];

export const INITIAL_EDGES: WorkflowEdge[] = [
  // Trigger -> Planner
  {
    id: 'edge-trigger-planner',
    sourceId: 'node-trigger',
    targetId: 'node-planner',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },

  // Planner bottom diamonds -> Sub-nodes (dashed with arrowhead pointing up)
  {
    id: 'edge-sub-model',
    sourceId: 'node-planner',
    targetId: 'sub-model',
    type: 'sub_dashed',
    sourceAnchor: 'diamond-0',
    targetAnchor: 'top',
    state: 'idle'
  },
  {
    id: 'edge-sub-memory',
    sourceId: 'node-planner',
    targetId: 'sub-memory',
    type: 'sub_dashed',
    sourceAnchor: 'diamond-1',
    targetAnchor: 'top',
    state: 'idle'
  },
  {
    id: 'edge-sub-tools',
    sourceId: 'node-planner',
    targetId: 'sub-tools',
    type: 'sub_dashed',
    sourceAnchor: 'diamond-2',
    targetAnchor: 'top',
    state: 'idle'
  },

  // Planner -> Decision "Needs screen vision?"
  {
    id: 'edge-planner-decision',
    sourceId: 'node-planner',
    targetId: 'node-decision-vision',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },

  // Decision -> FALSE branch (Top lane: Shell command)
  {
    id: 'edge-decision-shell-false',
    sourceId: 'node-decision-vision',
    targetId: 'node-action-shell',
    type: 'branch_false',
    label: 'false',
    color: '#6b7280',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },

  // Direct execution sequential chain
  {
    id: 'edge-shell-file',
    sourceId: 'node-action-shell',
    targetId: 'node-action-file',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },
  {
    id: 'edge-file-keyboard',
    sourceId: 'node-action-file',
    targetId: 'node-action-keyboard',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },
  {
    id: 'edge-keyboard-verify',
    sourceId: 'node-action-keyboard',
    targetId: 'node-decision-verify',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },

  // Decision -> TRUE branch (Bottom lane: Screenshot capture)
  {
    id: 'edge-decision-screenshot-true',
    sourceId: 'node-decision-vision',
    targetId: 'node-action-screenshot',
    type: 'branch_true',
    label: 'true',
    color: '#22c55e',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },

  // Vision pipeline sequential chain
  {
    id: 'edge-screenshot-omniparser',
    sourceId: 'node-action-screenshot',
    targetId: 'node-action-omniparser',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },
  {
    id: 'edge-omniparser-mapper',
    sourceId: 'node-action-omniparser',
    targetId: 'node-action-mapper',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },
  {
    id: 'edge-mapper-click',
    sourceId: 'node-action-mapper',
    targetId: 'node-action-click',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },
  {
    id: 'edge-click-verify',
    sourceId: 'node-action-click',
    targetId: 'node-decision-verify',
    type: 'main',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },

  // Verification Decision -> Task Complete (TRUE)
  {
    id: 'edge-verify-complete',
    sourceId: 'node-decision-verify',
    targetId: 'node-terminal-complete',
    type: 'branch_true',
    label: 'true',
    color: '#22c55e',
    sourceAnchor: 'right',
    targetAnchor: 'left',
    state: 'idle'
  },

  // Verification Decision -> Loop back to "Needs screen vision?" (FALSE / RETRY)
  {
    id: 'edge-verify-retry-loop',
    sourceId: 'node-decision-verify',
    targetId: 'node-decision-vision',
    type: 'loop_back',
    label: 'retry (max 2)',
    color: '#f59e0b',
    sourceAnchor: 'bottom',
    targetAnchor: 'bottom',
    state: 'idle'
  }
];

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'preset-direct',
    name: 'Direct Execution',
    commandText: 'Create a Python file and run it',
    branchType: 'direct',
    badgeLabel: 'Direct Plane (False)',
    badgeColor: '#f59e0b',
    description: 'Bypasses Vision entirely. Dispatches pure shell & file operations for sub-millisecond execution.',
    steps: [
      {
        nodeIds: ['node-trigger'],
        activeEdgeIds: [],
        durationMs: 700,
        statusMessage: 'Trigger: Command received → "Create a Python file and run it"',
        plane: 'Trigger Ingress',
        logDetail: {
          level: 'INFO',
          message: 'Received prompt via hotkey stream. Normalizing intent structure.',
          timestamp: '00:00.014'
        }
      },
      {
        nodeIds: ['node-planner', 'sub-model', 'sub-memory', 'sub-tools'],
        activeEdgeIds: ['edge-trigger-planner', 'edge-sub-model', 'edge-sub-memory', 'edge-sub-tools'],
        durationMs: 850,
        statusMessage: 'Planner agent synthesizing DAG with Gemini Flash Lite, Session memory & Tool library',
        plane: 'Neural Control Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Inference completed in 142ms. Generated 3 direct-action steps.',
          timestamp: '00:00.198'
        }
      },
      {
        nodeIds: ['node-decision-vision'],
        activeEdgeIds: ['edge-planner-decision'],
        durationMs: 650,
        statusMessage: 'Decision: "Needs screen vision?" → FALSE (Direct CLI/File API available)',
        plane: 'Neural Control Plane',
        logDetail: {
          level: 'DECISION',
          message: 'Target operations can execute via POSIX shell. Vision Plane skipped.',
          timestamp: '00:00.214'
        }
      },
      {
        nodeIds: ['node-action-shell'],
        activeEdgeIds: ['edge-decision-shell-false'],
        durationMs: 650,
        statusMessage: 'Direct Plane: Shell command → `mkdir -p ./scripts`',
        plane: 'Direct System Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Executed in subprocess (PID: 34109). Exit code: 0.',
          timestamp: '00:00.262'
        }
      },
      {
        nodeIds: ['node-action-file'],
        activeEdgeIds: ['edge-shell-file'],
        durationMs: 650,
        statusMessage: 'Direct Plane: File operation → `write_file ./scripts/app.py`',
        plane: 'Direct System Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Wrote 124 bytes to disk with sha256 checksum verification.',
          timestamp: '00:00.326'
        }
      },
      {
        nodeIds: ['node-action-keyboard'],
        activeEdgeIds: ['edge-file-keyboard'],
        durationMs: 650,
        statusMessage: 'Direct Plane: Keyboard action → `ctrl+\`` toggle terminal & run script',
        plane: 'Direct System Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Sent keychord to editor viewport. Python script executing.',
          timestamp: '00:00.358'
        }
      },
      {
        nodeIds: ['node-decision-verify'],
        activeEdgeIds: ['edge-keyboard-verify'],
        durationMs: 650,
        statusMessage: 'Verification Plane: Asserting exit code == 0 & file integrity',
        plane: 'Verification & State Plane',
        logDetail: {
          level: 'DECISION',
          message: 'All sanity checks passed. Process output confirmed.',
          timestamp: '00:00.410'
        }
      },
      {
        nodeIds: ['node-terminal-complete'],
        activeEdgeIds: ['edge-verify-complete'],
        durationMs: 800,
        statusMessage: 'Task complete: All steps verified! Audio chime dispatched.',
        plane: 'Verification & State Plane',
        logDetail: {
          level: 'SUCCESS',
          message: 'End-to-end execution completed in 420ms. Ready for next prompt.',
          timestamp: '00:00.420'
        }
      }
    ]
  },
  {
    id: 'preset-vision',
    name: 'Vision Pipeline',
    commandText: 'Open Chrome and go to youtube.com',
    branchType: 'vision',
    badgeLabel: 'Vision Plane (True)',
    badgeColor: '#f97362',
    description: 'GUI interaction required. Captures screen, runs OmniParser SoM detection, and grounds with Gemini 2.5 Flash.',
    steps: [
      {
        nodeIds: ['node-trigger'],
        activeEdgeIds: [],
        durationMs: 700,
        statusMessage: 'Trigger: Command received → "Open Chrome and go to youtube.com"',
        plane: 'Trigger Ingress',
        logDetail: {
          level: 'INFO',
          message: 'Voice transcription stream parsed: Target application "Chrome".',
          timestamp: '00:00.015'
        }
      },
      {
        nodeIds: ['node-planner', 'sub-model', 'sub-memory', 'sub-tools'],
        activeEdgeIds: ['edge-trigger-planner', 'edge-sub-model', 'edge-sub-memory', 'edge-sub-tools'],
        durationMs: 850,
        statusMessage: 'Planner agent querying sub-models for GUI browser automation sequence',
        plane: 'Neural Control Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Determined visual grounding requirement for browser viewport.',
          timestamp: '00:00.200'
        }
      },
      {
        nodeIds: ['node-decision-vision'],
        activeEdgeIds: ['edge-planner-decision'],
        durationMs: 650,
        statusMessage: 'Decision: "Needs screen vision?" → TRUE (GUI spatial target required)',
        plane: 'Neural Control Plane',
        logDetail: {
          level: 'DECISION',
          message: 'Browser navigation requires visual grounding. Routing to Vision Plane.',
          timestamp: '00:00.216'
        }
      },
      {
        nodeIds: ['node-action-screenshot'],
        activeEdgeIds: ['edge-decision-screenshot-true'],
        durationMs: 650,
        statusMessage: 'Vision Plane: Screenshot capture → 2560x1440 full desktop frame',
        plane: 'Vision Action Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Hardware frame grab completed in 85ms.',
          timestamp: '00:00.301'
        }
      },
      {
        nodeIds: ['node-action-omniparser'],
        activeEdgeIds: ['edge-screenshot-omniparser'],
        durationMs: 750,
        statusMessage: 'Vision Plane: OmniParser detection → Extracted 34 SoM element boxes',
        plane: 'Vision Action Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Annotated screen with Set-of-Mark tags for UI elements.',
          timestamp: '00:00.541'
        }
      },
      {
        nodeIds: ['node-action-mapper'],
        activeEdgeIds: ['edge-omniparser-mapper'],
        durationMs: 750,
        statusMessage: 'Vision Plane: Vision mapper → Gemini 2.5 Flash identified URL input (ID: 3)',
        plane: 'Vision Action Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Visual grounding mapped element #3 to target point (x: 540, y: 82).',
          timestamp: '00:00.831'
        }
      },
      {
        nodeIds: ['node-action-click'],
        activeEdgeIds: ['edge-mapper-click'],
        durationMs: 650,
        statusMessage: 'Vision Plane: Click coordinates → PyAutoGUI click & URL typing dispatched',
        plane: 'Vision Action Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Synthesized click at (540, 82) and typed "https://youtube.com".',
          timestamp: '00:00.926'
        }
      },
      {
        nodeIds: ['node-decision-verify'],
        activeEdgeIds: ['edge-click-verify'],
        durationMs: 650,
        statusMessage: 'Verification Plane: Validating URL bar state & page load lifecycle',
        plane: 'Verification & State Plane',
        logDetail: {
          level: 'DECISION',
          message: 'Browser window title updated to "YouTube". Visual confirmation OK.',
          timestamp: '00:00.978'
        }
      },
      {
        nodeIds: ['node-terminal-complete'],
        activeEdgeIds: ['edge-verify-complete'],
        durationMs: 800,
        statusMessage: 'Task complete: Chrome navigated to youtube.com successfully!',
        plane: 'Verification & State Plane',
        logDetail: {
          level: 'SUCCESS',
          message: 'Vision execution finished in 988ms with 99.4% confidence score.',
          timestamp: '00:00.988'
        }
      }
    ]
  },
  {
    id: 'preset-retry',
    name: 'Self-Healing Fallback',
    commandText: 'Debug script and click error fix button',
    branchType: 'retry_fallback',
    badgeLabel: 'Retry Loop (False → True)',
    badgeColor: '#eab308',
    description: 'Demonstrates JARVIS resilience: Direct execution encounters a missing window → Verification triggers retry → Routes to Vision Plane to ground and succeed!',
    steps: [
      {
        nodeIds: ['node-trigger'],
        activeEdgeIds: [],
        durationMs: 650,
        statusMessage: 'Trigger: Command received → "Debug script and click error fix button"',
        plane: 'Trigger Ingress',
        logDetail: {
          level: 'INFO',
          message: 'Ingesting debug directive.',
          timestamp: '00:00.012'
        }
      },
      {
        nodeIds: ['node-planner', 'sub-model', 'sub-memory', 'sub-tools'],
        activeEdgeIds: ['edge-trigger-planner', 'edge-sub-model', 'edge-sub-memory', 'edge-sub-tools'],
        durationMs: 800,
        statusMessage: 'Planner agent evaluating fast-path direct CLI vs visual debugger UI',
        plane: 'Neural Control Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Attempting fast Direct Execution path first.',
          timestamp: '00:00.180'
        }
      },
      {
        nodeIds: ['node-decision-vision'],
        activeEdgeIds: ['edge-planner-decision'],
        durationMs: 600,
        statusMessage: 'Decision: "Needs screen vision?" → FALSE (Testing direct CLI hook)',
        plane: 'Neural Control Plane',
        logDetail: {
          level: 'DECISION',
          message: 'Attempting zero-overhead direct plane invocation.',
          timestamp: '00:00.195'
        }
      },
      {
        nodeIds: ['node-action-shell'],
        activeEdgeIds: ['edge-decision-shell-false'],
        durationMs: 600,
        statusMessage: 'Direct Plane: Shell command → `pytest --trace`',
        plane: 'Direct System Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Test runner failed with UI-dependent prompt dialog.',
          timestamp: '00:00.245'
        }
      },
      {
        nodeIds: ['node-decision-verify'],
        activeEdgeIds: ['edge-keyboard-verify'],
        durationMs: 650,
        statusMessage: 'Verification: Assert failed! Interactive dialog detected on screen.',
        plane: 'Verification & State Plane',
        logDetail: {
          level: 'WARN',
          message: 'Direct plane could not dismiss GUI modal. Triggering loop-back retry!',
          timestamp: '00:00.310'
        }
      },
      {
        nodeIds: ['node-decision-vision'],
        activeEdgeIds: ['edge-verify-retry-loop'],
        durationMs: 700,
        statusMessage: 'Loop-back: "retry (1/2)" → Switching plane to Vision Pipeline (TRUE)',
        plane: 'Neural Control Plane',
        logDetail: {
          level: 'DECISION',
          message: 'Self-healing policy dynamically activated Vision Action Plane.',
          timestamp: '00:00.330'
        }
      },
      {
        nodeIds: ['node-action-screenshot'],
        activeEdgeIds: ['edge-decision-screenshot-true'],
        durationMs: 600,
        statusMessage: 'Vision Plane: Screenshot capture → Desktop frame grabbed',
        plane: 'Vision Action Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Captured error modal dialog on screen.',
          timestamp: '00:00.415'
        }
      },
      {
        nodeIds: ['node-action-omniparser'],
        activeEdgeIds: ['edge-screenshot-omniparser'],
        durationMs: 700,
        statusMessage: 'Vision Plane: OmniParser detection → Tagged "Apply Fix" modal button',
        plane: 'Vision Action Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Isolated "Quick Fix" button bounding box at SoM mark #12.',
          timestamp: '00:00.655'
        }
      },
      {
        nodeIds: ['node-action-mapper'],
        activeEdgeIds: ['edge-omniparser-mapper'],
        durationMs: 700,
        statusMessage: 'Vision Plane: Vision mapper → Gemini 2.5 Flash computed target coordinates',
        plane: 'Vision Action Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Mapped click target to (x: 820, y: 460).',
          timestamp: '00:00.945'
        }
      },
      {
        nodeIds: ['node-action-click'],
        activeEdgeIds: ['edge-mapper-click'],
        durationMs: 600,
        statusMessage: 'Vision Plane: Click coordinates → Clicked "Apply Fix"',
        plane: 'Vision Action Plane',
        logDetail: {
          level: 'EXEC',
          message: 'Dispatched mouse click on modal fix button. Error resolved.',
          timestamp: '00:01.040'
        }
      },
      {
        nodeIds: ['node-decision-verify'],
        activeEdgeIds: ['edge-click-verify'],
        durationMs: 600,
        statusMessage: 'Verification: Assert passed! Error cleared & test passing.',
        plane: 'Verification & State Plane',
        logDetail: {
          level: 'SUCCESS',
          message: 'Self-healing retry succeeded without human intervention.',
          timestamp: '00:01.092'
        }
      },
      {
        nodeIds: ['node-terminal-complete'],
        activeEdgeIds: ['edge-verify-complete'],
        durationMs: 800,
        statusMessage: 'Task complete: Self-healing multi-plane loop successfully recovered!',
        plane: 'Verification & State Plane',
        logDetail: {
          level: 'SUCCESS',
          message: 'Self-healing workflow verified. State synchronized.',
          timestamp: '00:01.100'
        }
      }
    ]
  }
];
