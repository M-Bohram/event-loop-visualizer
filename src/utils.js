export const getInterval = (speed) => {
  if (speed === "Very Fast") {
    return 600;
  } else if (speed === "Fast") {
    return 800;
  } else if (speed === "Average") {
    return 1100;
  } else if (speed === "Slow") {
    return 1500;
  } else if (speed === "Very Slow") {
    return 3000;
  } else {
    return 800;
  }
};
