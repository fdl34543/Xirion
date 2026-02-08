// src/api/types.ts

export type ExecutionMode = "api" | "agent" | "cli";

export type ApiResponse<T> = {
  status: "ok" | "error";
  data?: T;
  error?: string;
};
