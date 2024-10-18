export class ContactLockedEvent {
  constructor(
    public readonly contactId: string,
    public readonly username: string,
  ) {}
}

export class ContactUnlockedEvent {
  constructor(public readonly contactId: string) {}
}
