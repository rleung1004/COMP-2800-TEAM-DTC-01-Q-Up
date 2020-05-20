/**
 * Route the customers to the appropriate view according to their type.
 * @param res a server response
 */
export default function RouteUsers(res: any) {
  switch (res.data.userType) {
    case "manager":
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.generatedToken,
          type: "manager",
        })
      );
      window.location.href = "/businessDashBoard";
      break;
    case "employee":
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.generatedToken,
          type: "employee",
        })
      );
      window.location.href = "/teller";
      break;
    case "display":
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.generatedToken,
          type: "display",
        })
      );
      break;
    case "booth":
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.generatedToken,
          type: "booth",
        })
      );
      window.location.href = "/boothDashBoard";
      break;
    default:
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.generatedToken,
          type: res.data.userType,
          email: res.data.userEmail,
        })
      );
      window.location.href = "/consumerDashboard";
      break;
  }
}
