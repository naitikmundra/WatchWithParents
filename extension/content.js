async function searchByUrl() {

    // Get the current page URL
    const pageUrl = window.location.href;

    try {
        // Path to the config.json file hosted on your static website
        const configUrl = 'https://naitikmundra.xyz/config.json';

        // Fetch the config file and store the URL in a variable
        const configResponse = await fetch(configUrl);
        if (!configResponse.ok) {
            throw new Error(`Failed to fetch config: ${configResponse.status}`);
        }
        const config = await configResponse.json();
        const apiUrl = config.apiUrl; // Store the fetched URL
        console.log("Fetched API URL:", apiUrl);
        
        // Make a POST request to the fetched API URL
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: pageUrl }),
        });

        if (!response.ok) {
            alert("No data for NSFW scenes for this web page's media! -WWP");
        }

        const data = await response.json();
        
        if (data && data.durations) {
            const durationStr = data.durations; // Fetching 'duration' field from server
            const skipRanges = parseDurationToRanges(durationStr);

            // Apply skipping logic to all video elements
            const videos = document.querySelectorAll("video");
            if (videos.length > 0) {
                videos.forEach(video => {
                    video.addEventListener("timeupdate", () => {
                        const currentTime = video.currentTime;
                        const skipTo = shouldSkip(skipRanges, currentTime);
                        if (skipTo !== null) {
                            video.currentTime = skipTo;
                        }
                    });
                });
                alert("Applied wwp protection, NSFW scenes skipped, enjoy watching!");
                console.log("Time-skipping logic applied to video.");
            } else {
                alert("No media/video player found on this page");
                console.log("No video elements found on this page.");
            }
        } else {

            console.log("No durations returned from the server.");
        }
    } catch (error) {
        console.error("Error fetching durations from server:", error);
    }
}

// Function to parse duration string into an array of {start, end} ranges
function parseDurationToRanges(durationStr) {
    return durationStr.split(',').map(range => {
        const [start, end] = range.split('-').map(Number);
        return { start, end };
    });
}

// Function to check if the current time is within any skip range
function shouldSkip(skipRanges, currentTime) {
    const timeBuffer = 0.5; // Buffer to account for the timeupdate delay
    for (const range of skipRanges) {
        if (currentTime + timeBuffer >= range.start && currentTime <= range.end) {
            return range.end; // Return the end time of the range to skip to
        }
    }
    return null; // No skipping needed
}

// Example usage
searchByUrl();
