const axios = require('axios');

class LLMRouter {
    constructor() {
        this.providers = {
            openai: {
                name: 'OpenAI',
                url: 'https://api.openai.com/v1/chat/completions',
                key: process.env.OPENAI_API_KEY || '',
                costPer1k: 0.002, // generic heuristic
                latency: 500 // generic heuristic ms
            },
            anthropic: {
                name: 'Anthropic',
                url: 'https://api.anthropic.com/v1/messages',
                key: process.env.ANTHROPIC_API_KEY || '',
                costPer1k: 0.003,
                latency: 600
            },
            ollama: {
                name: 'Ollama (Local)',
                url: 'http://localhost:11434/api/chat',
                key: 'none',
                costPer1k: 0.0,
                latency: 200 // Assuming fast local machine
            }
        };
    }

    setKey(provider, key) {
        if (this.providers[provider]) {
            this.providers[provider].key = key;
        }
    }

    _selectBestProvider(taskCategory) {
        // Example routing logic based on task
        // In reality, this could be dynamic user-defined weights
        let best = null;

        // Prioritize local for cost/privacy if it's available
        if (this.providers.ollama && this._isOllamaRunning()) {
            return 'ollama';
        }

        // Otherwise find cheapest available
        for (const [key, details] of Object.entries(this.providers)) {
            if (key === 'ollama') continue; // Handled above
            if (!details.key) continue; // No API key

            if (!best || details.costPer1k < this.providers[best].costPer1k) {
                best = key;
            }
        }

        return best || 'openai'; // Fallback
    }

    // Mock check for local Ollama
    _isOllamaRunning() {
       // A real implementation would ping http://localhost:11434/
       return false;
    }

    async routeRequest(prompt, taskCategory = 'general') {
        const primary = this._selectBestProvider(taskCategory);
        let currentProvider = primary;

        const fallbackQueue = Object.keys(this.providers).filter(
            p => p !== primary && this.providers[p].key
        );

        while (currentProvider) {
            try {
                console.log(`Attempting request via ${this.providers[currentProvider].name}...`);
                const response = await this._callProvider(currentProvider, prompt);
                return {
                    provider: currentProvider,
                    response: response,
                    status: 'success'
                };
            } catch (error) {
                console.warn(`Provider ${currentProvider} failed. Error: ${error.message}`);
                currentProvider = fallbackQueue.shift(); // Get next fallback
                if (currentProvider) {
                    console.log(`Falling back to ${currentProvider}...`);
                }
            }
        }

        throw new Error('All configured LLM providers failed.');
    }

    async _callProvider(provider, prompt) {
        // Implementation for standard API calls
        // Note: For a real app, you need specific payload formatting per provider.
        // This is a generic mockup structure.
        const config = this.providers[provider];

        if (provider === 'openai') {
            const res = await axios.post(config.url, {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            }, {
                headers: { 'Authorization': `Bearer ${config.key}` }
            });
            return res.data.choices[0].message.content;
        }

        if (provider === 'ollama') {
            const res = await axios.post(config.url, {
                model: "llama2",
                messages: [{ role: "user", content: prompt }],
                stream: false
            });
            return res.data.message.content;
        }

        // Anthropic mock
        throw new Error('Provider specific implementation required');
    }
}

module.exports = new LLMRouter();
