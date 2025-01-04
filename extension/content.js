//this is the main js extension's code that is injected onto the page
async function searchByUrl() {

    const pageUrl = window.location.href;

    try {
        // fetch server url from my website :) so that it is easily changable
        const configUrl = 'https://naitikmundra.xyz/config.json';

        const configResponse = await fetch(configUrl);
        if (!configResponse.ok) {
            throw new Error(`Failed to fetch config: ${configResponse.status}`);
        }
        const config = await configResponse.json();
        const apiUrl = config.apiUrl; // Page's url
        console.log("Fetched API URL:", apiUrl);
        
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
            const durationStr = data.durations; 
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


function parseDurationToRanges(durationStr) {
    return durationStr.split(',').map(range => {
        const [start, end] = range.split('-').map(Number);
        return { start, end };
    });
}

function shouldSkip(skipRanges, currentTime) {
    const timeBuffer = 0.5; 
    for (const range of skipRanges) {
        if (currentTime + timeBuffer >= range.start && currentTime <= range.end) {
            return range.end; // HERE LIES THE END OF THE RANGE LOL :))))
        }
    }
    return null; 
}

searchByUrl();
