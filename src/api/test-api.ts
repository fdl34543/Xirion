const BASE_URL = "https://xirion.onrender.com/api";

async function test(
  name: string,
  path: string,
  options?: RequestInit
): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const text = await res.text();
    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    console.log(`✔ ${name}`);
    console.log(`  ${options?.method ?? "GET"} ${path}`);
    console.log(`  Status: ${res.status}`);
    console.log("Response:");
    console.log(JSON.stringify(data, null, 2));
    console.log("");
  } catch (err) {
    console.error(`✖ ${name}`);
    console.error(err);
    console.log("");
  }
}

async function run(): Promise<void> {
  console.log("=== API TEST START ===\n");

  // /heartbeat (GET)
  await test("Heartbeat", "/heartbeat");

  // /alpha (POST)
  await test("Alpha", "/alpha", {
    method: "POST",
    body: JSON.stringify({}),
  });

  // /analyzeToken (POST)
  await test("Analyze Token", "/analyzeToken", {
    method: "POST",
    body: JSON.stringify({
      tokenAddress: "F2HKzbqS6szcNKNmDgs8M7f5Ss8TSXPRbZEG6oL8pump",
    }),
  });

  await test("Yield Pool", "/yield/pool", {
    method: "POST",
    body: JSON.stringify({}),
  });

  console.log("=== API TEST END ===");
}

run();
