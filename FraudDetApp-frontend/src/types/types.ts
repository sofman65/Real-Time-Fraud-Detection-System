export interface Transaction {
  Time: number;
  Amount: number;
  Class?: number;
  [key: string]: number | undefined;
}

export interface Prediction {
  logistic: number;
  random_forest: number;
  xgboost: number;
}

export interface Metrics {
  totalTransactions: number;
  fraudulentTransactions: number;
  accuracies: {
    logistic: number;
    random_forest: number;
    xgboost: number;
  };
}
