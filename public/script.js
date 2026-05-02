const form = document.getElementById('shortenForm');
const longUrlInput = document.getElementById('longUrl');
const resultDiv = document.getElementById('result');
const shortUrlInput = document.getElementById('shortUrl');
const originalUrlText = document.getElementById('originalUrl');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const longUrl = longUrlInput.value.trim();

    if (!longUrl) {
        showError('Please enter a valid URL');
        return;
    }

    await shortenUrl(longUrl);
});



async function shortenUrl(originalUrl) {
    try {
        // Show loading state
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');

        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to shorten URL');
        }

        const data = await response.json();

        // Show result
        loadingDiv.classList.add('hidden');
        shortUrlInput.value = `${data.shortenedURL}`;
        originalUrlText.textContent = originalUrl;
        resultDiv.classList.remove('hidden');

        // Clear form
        longUrlInput.value = '';
    } catch (error) {
        loadingDiv.classList.add('hidden');
        showError(error.message || 'An error occurred. Please try again.');
    }
}

function showError(message) {
    resultDiv.classList.add('hidden');
    loadingDiv.classList.add('hidden');
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
}

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(shortUrlInput.value);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
});

// Clear error when user starts typing
longUrlInput.addEventListener('input', () => {
    if (!errorDiv.classList.contains('hidden')) {
        errorDiv.classList.add('hidden');
    }
});
