import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@__tests__/utils/customRender";
import { api } from "@services/api";
import { Dashboard } from ".";
import { saveStorageCity } from "@libs/asyncStorage/cityStorage";
import { mockWeatherAPIResponse } from "@__tests__/mocks/api/mockWeatherAPIResponse";
import { mockCityApiResponse } from "@__tests__/mocks/api/mockCityApiResponse";

describe("Screen: Dashboard", () => {
  beforeAll(async () => {
    const city = {
      id: "1",
      name: "Rio do Sul, BR",
      latitude: 123,
      longitude: 456,
    };

    await saveStorageCity(city);
  });

  it("should show city weather", async () => {
    jest.spyOn(api, "get").mockResolvedValue({ data: mockWeatherAPIResponse });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/rio do sul/i)).toBeTruthy();
    });
  });

  it("should show another selected weather city", async () => {
    jest
      .spyOn(api, "get")
      .mockResolvedValueOnce({ data: mockWeatherAPIResponse }) // 1ª chamada - cidade salva
      .mockResolvedValueOnce({ data: mockCityApiResponse }) // 2ª chamada - buscar cidade digitada
      .mockResolvedValueOnce({ data: mockWeatherAPIResponse }); // 3ª chamada - novo clima

    render(<Dashboard />);

    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"));

    const cityName = "São Paulo";

    const search = screen.getByTestId("search-input");
    fireEvent.changeText(search, cityName);

    await waitFor(() => {
      fireEvent.press(screen.getByText(cityName, { exact: false }));
    });

    await waitFor(() => {
      expect(screen.getByText(cityName, { exact: false })).toBeTruthy();
    });
  });
});
