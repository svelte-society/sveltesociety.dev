/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: import("@sveltejs/kit").GetSession = async () => {
	const events = await Promise.all(
	  Object.entries(import.meta.glob("/src/routes/events/*.svx")).map(
		async ([path, page]) => {
		  const { metadata } = await page();
		  const filename = path.split("/").pop();
		  return { ...metadata, filename };
		}
	  )
	);
	events.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  
	return {
	  events,
	};
  };