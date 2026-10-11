box._state = {
    type: "empty" | "existing" | "new",
    file: File | null,
    filename: string | null, // S3 key (which is the filename) only
    url: string | null, // for preview only
    blobUrl: string | null, // lifecycle tracked safely
};
