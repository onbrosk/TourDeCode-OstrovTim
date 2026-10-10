export interface Member {
  id: number;
  name: string;
  surname: string;
}

export interface Team {
  id: number;
  name: string;
}

export interface HealthResponse {
  status: "ok";
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/v1/health`);
  if (!res.ok) {
    throw new Error(`Health check failed with HTTP ${res.status}`);
  }

  const data: unknown = await res.json();
  if (typeof data !== "object" || data === null || !("status" in data) || data.status !== "ok") {
    throw new Error("Health check returned an invalid response");
  }

  return { status: data.status };
}
export async function getMembers(): Promise<Member[]> {
  const res = await fetch(`${API_URL}/members`);
  if (!res.ok) {
    throw new Error(`Failed to load members: HTTP ${res.status}`);
  }

  const data: unknown = await res.json();
  if (
    !Array.isArray(data) ||
    !data.every(
      (member: unknown) =>
        typeof member === "object" &&
        member !== null &&
        "id" in member &&
        typeof member.id === "number" &&
        "name" in member &&
        typeof member.name === "string" &&
        "surname" in member &&
        typeof member.surname === "string"
    )
  ) {
    throw new Error("Members API returned an invalid response");
  }

  return data;
}

export async function getTeams(): Promise<Team[]> {
  const res = await fetch(`${API_URL}/teams`);
  if (!res.ok) {
    throw new Error(`Failed to load teams: HTTP ${res.status}`);
  }

  const data: unknown = await res.json();
  if (
    !Array.isArray(data) ||
    !data.every(
      (team: unknown) =>
        typeof team === "object" &&
        team !== null &&
        "id" in team &&
        typeof team.id === "number" &&
        "name" in team &&
        typeof team.name === "string"
    )
  ) {
    throw new Error("Teams API returned an invalid response");
  }

  return data;
}

