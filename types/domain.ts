export type EventType =
  | 'QUESTION_VIEWED'
  | 'HINT_REQUESTED'
  | 'OPTION_HOVERED'
  | 'ANSWER_SUBMITTED'
  | 'STRATEGY_CHANGED'
  | 'TAB_SWITCHED';

export type TeachingStrategy =
  | 'SOCRATIC'
  | 'EXAMPLE_FIRST'
  | 'THEORY_FIRST'
  | 'DISCOVERY'
  | 'CHALLENGE';

export type DeliveryFormat =
  | 'TEXT'
  | 'ANIMATION'
  | 'SIMULATION'
  | 'DIALOGUE'
  | 'INTERACTIVE_STEP';

export interface EventPayload {
  nodeId?: string;
  timeSpentMs?: number;
  currentStrategy?: TeachingStrategy;
  currentFormat?: DeliveryFormat;
  metadata?: Record<string, unknown>;
}

export interface LearningEvent {
  eventId: string;
  userId: string;
  timestamp: string | Date;
  eventType: EventType;
  payload: EventPayload;
}

export interface BayesianLearningProfile {
  userId: string;
  confidenceScore: number;
  strategyWeights: Record<TeachingStrategy, number>;
  formatWeights: Record<DeliveryFormat, number>;
}
