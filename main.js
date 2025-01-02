async function searchByUrl() {
    // Get the current page URL
    const pageUrl = window.location.href;

    try {
        // Make a POST request to your server
        const response = await fetch("https://wwp-cloud.onrender.com/search-by-url", { // Replace with your server URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: pageUrl }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
                console.log("Time-skipping logic applied to video.");
            } else {
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
