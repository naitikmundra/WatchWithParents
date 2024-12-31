// Specify the time ranges to skip in seconds
const skipRanges = [
    { start: 59, end: 119 }, // 0:59 to 1:59
   
];

// Buffer to account for the timeupdate delay
const timeBuffer = 0.5; // Adjust if needed, in seconds

// Function to check if the current time is within any skip range
function shouldSkip(currentTime) {
    for (const range of skipRanges) {
        if (currentTime + timeBuffer >= range.start && currentTime <= range.end) {
            return range.end; // Return the end time of the range to skip to
        }
    }
    return null; // No skipping needed
}

// Function to get minutes and seconds from total seconds
function getFormattedTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Detect all video elements on the page
const videos = document.querySelectorAll("video");

if (videos.length > 0) {
    videos.forEach(video => {
        // Add an event listener to check the time periodically
        video.addEventListener("timeupdate", () => {
            const currentTimeFormatted = getFormattedTime(video.currentTime);
            const skipTo = shouldSkip(video.currentTime);
            if (skipTo !== null) {
                console.log(`Current time: ${currentTimeFormatted}. Skipping to: ${getFormattedTime(skipTo)}.`);
                video.currentTime = skipTo;
            }
        });
        console.log("Time-skipping logic applied to video.");
    });
} else {
    console.log("No video elements found on this page.");
}

