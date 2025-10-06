/**
 * Trompt - Modern CLI questionnaire library
 * TypeScript definitions for comprehensive type safety and IntelliSense
 */

export type PromptType = 'input' | 'password' | 'number' | 'integer' | 'int' | 'select' | 'list' | 'checkbox';

export interface BasePromptConfig {
  /** The question to display to the user */
  question?: string;
  /** Alias for question (inquirer compatibility) */
  message?: string;
  /** Default value for the prompt */
  default?: any;
}

export interface InputPromptConfig extends BasePromptConfig {
  type: 'input';
  default?: string;
  validate?: (value: string) => boolean | string;
}

export interface PasswordPromptConfig extends BasePromptConfig {
  type: 'password';
  default?: string;
  validate?: (value: string) => boolean | string;
}

export interface NumberPromptConfig extends BasePromptConfig {
  type: 'number' | 'integer' | 'int';
  default?: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Suffix to display after the number (e.g., 'cm', 'kg') */
  suffix?: string;
  /** Whether this is an integer-only input */
  integer?: boolean;
  validate?: (value: number) => boolean | string;
}

export interface Choice {
  /** The display text for this choice */
  text: string;
  /** The value to return when this choice is selected */
  value: any;
  /** Whether this choice is initially selected (checkbox only) */
  selected?: boolean;
}

export type ChoiceInput = string | number | Choice;

export interface SelectPromptConfig extends BasePromptConfig {
  type: 'select' | 'list';
  /** Array of choices to select from */
  choices: ChoiceInput[];
  /** Index of the default selected choice */
  default?: number;
  validate?: (value: any) => boolean | string;
}

export interface CheckboxPromptConfig extends BasePromptConfig {
  type: 'checkbox';
  /** Array of choices to select from */
  choices: ChoiceInput[];
  /** Array of default selected values */
  default?: any[];
  validate?: (value: any[]) => boolean | string;
}

export type PromptConfig = 
  | InputPromptConfig 
  | PasswordPromptConfig 
  | NumberPromptConfig 
  | SelectPromptConfig 
  | CheckboxPromptConfig;

// Enhanced return type mapping
type PromptReturnType<T extends PromptConfig> = 
  T extends InputPromptConfig ? string :
  T extends PasswordPromptConfig ? string :
  T extends NumberPromptConfig ? number :
  T extends SelectPromptConfig ? any :
  T extends CheckboxPromptConfig ? any[] :
  any;

/**
 * Main prompt function - overloaded for different input types and better IntelliSense
 */
export function prompt(question: string): Promise<string>;
export function prompt(question: number): Promise<string>;
export function prompt<T extends PromptConfig>(question: T): Promise<PromptReturnType<T>>;
export function prompt(question: PromptConfig[]): Promise<any[]>;

export interface InquirerQuestionBase {
  /** Unique name for this question (required for inquirer-style API) */
  name: string;
  /** The question to display to the user */
  question?: string;
  /** Alias for question (inquirer compatibility) */
  message?: string;
  /** Default value for the prompt */
  default?: any;
  /** Validation function that returns true if valid, or error message if invalid */
  validate?: (value: any) => boolean | string;
}

export interface InquirerInputQuestion extends InquirerQuestionBase {
  type: 'input';
  default?: string;
  validate?: (value: string) => boolean | string;
}

export interface InquirerPasswordQuestion extends InquirerQuestionBase {
  type: 'password';
  default?: string;
  validate?: (value: string) => boolean | string;
}

export interface InquirerNumberQuestion extends InquirerQuestionBase {
  type: 'number' | 'integer' | 'int';
  default?: number;
  min?: number;
  max?: number;
  suffix?: string;
  integer?: boolean;
  validate?: (value: number) => boolean | string;
}

export interface InquirerSelectQuestion extends InquirerQuestionBase {
  type: 'select' | 'list';
  choices: ChoiceInput[];
  default?: number;
  validate?: (value: any) => boolean | string;
}

export interface InquirerCheckboxQuestion extends InquirerQuestionBase {
  type: 'checkbox';
  choices: ChoiceInput[];
  default?: any[];
  validate?: (value: any[]) => boolean | string;
}

export type InquirerQuestion = 
  | InquirerInputQuestion 
  | InquirerPasswordQuestion 
  | InquirerNumberQuestion 
  | InquirerSelectQuestion 
  | InquirerCheckboxQuestion;

export interface InquirerAnswers {
  [key: string]: any;
}

export interface InquirerAPI {
  /**
   * Prompt multiple questions and return an object with named answers
   * @param questions - Array of question objects with 'name' property
   * @returns Object mapping question names to answers
   */
  prompt(questions: InquirerQuestion[]): Promise<InquirerAnswers>;
}

/**
 * Inquirer-compatible API for handling multiple questions
 */
export const inquirer: InquirerAPI;

// Default export
export default prompt;

// Re-export types for convenience (already exported above)
// Choice, ChoiceInput, InquirerQuestion, InquirerAnswers, QuestionInput are already exported