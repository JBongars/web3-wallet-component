import { MyAlgo, MyAlgoState } from "./myalgo";

type AlgorandState = {
  myAlgo?: MyAlgoState;
};

class Algorand {
  public myAlgo: MyAlgo;

  constructor(data?: AlgorandState) {
    this.myAlgo = new MyAlgo(data?.myAlgo);
  }
}

export { Algorand, AlgorandState };
