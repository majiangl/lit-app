export default {
  "*.ts": [
    /* Run tsc incrementally for all related files */
    () => "tsc",
    "eslint --fix",
    "prettier --write",
  ]
};
