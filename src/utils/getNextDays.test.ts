import { getNextDays } from "./getNextDays";

describe("getNextDays", () => {
  it("should be return the next five days", () => {
    // Executar o nosso teste ...
    const days = getNextDays();
    //   console.log(days);

    expect(days.length).toBe(5);
  });
});
