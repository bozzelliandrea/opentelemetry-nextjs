export async function getCall_NEXT() {
  const response = await fetch("/api/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();

  console.log(body);

  return body;
}

