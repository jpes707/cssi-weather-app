// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1

let city = "Mountain View";
let state = "CA";

const inputField = document.querySelector("#input-box");
inputField.addEventListener("change", () => {
  const inputInfo = inputField.value.split(", ");
  const city = inputInfo[0];
  const state = inputInfo[1];

  document.getElementById("column1").innerHTML = "";
  document.getElementById("column2").innerHTML = "";

  console.log(city + ", " + state);

  const ajax_params_lat_lng = {
    url: "https://open.mapquestapi.com/geocoding/v1/address",
    type: "get",
    data: {
      key: "POdVAIJE4EsTvKG3YFL70zG5C4OLFrB7",
      city: city,
      state: state
    },
    success: response => {
      console.log(response["results"][0]["locations"][0]["latLng"]);

      document.getElementById("location-img").src =
        response["results"][0]["locations"][0]["mapUrl"];

      const lat = response["results"][0]["locations"][0]["latLng"]["lat"];
      const lng = response["results"][0]["locations"][0]["latLng"]["lng"];

      const ajax_params_gov_first = {
        url: `https://api.weather.gov/points/${lat},${lng}`,
        type: "get",
        success: response => {
          console.log(response["properties"]["forecastGridData"]);

          const grid_data_url =
            response["properties"]["forecastGridData"] + "/forecast";

          const ajax_params_gov_second = {
            url: grid_data_url,
            type: "get",
            success: response => {
              console.log(response["properties"]["periods"]);

              let periods = response["properties"]["periods"];

              periods.forEach(day => {
                let n = day.number;

                let card = `
                <div class="card">
                   <header class="card-header">
                      <p  class="card-header-title">
                         ${day.name} - ${day.startTime.substring(5, 10)}
                      </p>
                      <i class="card-header-icon" aria-label="more options">
                      <span class="icon">
                      <img
                         src=${day.icon}
                         />
                      </span>
                      </i>
                   </header>
                   <div class="card-content">
                      <div class="content">
                         <p class="subtitle">
                            ${day.temperature}${day.temperatureUnit} - ${
                  day.shortForecast
                }
                         </p>
                         <br />
                         <div class="dropdown is-hoverable">
                              <div class="dropdown-trigger">
                                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                  <span>More Info</span>
                                </button>
                              </div>
                              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                                <div class="dropdown-content">
                                  <div class="dropdown-item">
                                    <table class="table">
                                                        <tbody>
                                                           <tr>
                                                              <td>Forecast</td>
                                                              <td>${
                                                                day.detailedForecast
                                                              }</td>
                                                           </tr>
                                                           <tr>
                                                              <td>Wind</td>
                                                              <td>${
                                                                day.windSpeed
                                                              } ${
                  day.windDirection
                }</td>
                                                           </tr>
                                                        </tbody>
                                                     </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                      </div>
                   </div>
                   <footer class="card-footer"></footer>
                </div>
                `;

                let column = `column${((n - 1) % 2) + 1}`;
                document.getElementById(column).innerHTML =
                  document.getElementById(column).innerHTML + card;
              });
            }
          };
          $.ajax(ajax_params_gov_second);
        }
      };
      $.ajax(ajax_params_gov_first);
    }
  };
  $.ajax(ajax_params_lat_lng);

  document.getElementById(
    "header"
  ).innerHTML = `Weather in ${inputField.value}`;
  inputField.value = "";
});
