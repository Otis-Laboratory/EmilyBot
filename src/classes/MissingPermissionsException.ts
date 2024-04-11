export class MissingPermissionException {
  public message = "Missing permissions.";

  constructor(public permissions: string[]) {}

  public toString() {
    return `${this.message} ${this.permissions.join(", ")}`;
  }
}