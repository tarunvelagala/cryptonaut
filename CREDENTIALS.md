# Getting API Credentials for Cryptonaut

## Telegram Bot Token

### Steps to Create a Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** with BotFather
3. **Create a new bot**:
   - Send the command: `/newbot`
   - Follow the prompts:
     - Choose a name for your bot (e.g., "Cryptonaut Assistant")
     - Choose a username (must end in 'bot', e.g., "cryptonaut_assistant_bot")
4. **Copy the token**: BotFather will provide you with a token that looks like:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
5. **Save this token** - you'll use it when deploying the CDK stack

### Optional: Configure Bot Settings
- Send `/setdescription` to add a description
- Send `/setabouttext` to add an "About" section
- Send `/setuserpic` to upload a profile picture

---

## CrewAI API Key

CrewAI is a framework for orchestrating AI agents. To get an API key:

### Option 1: CrewAI Cloud (Recommended)
1. **Visit**: [https://www.crewai.com/](https://www.crewai.com/)
2. **Sign up** for a CrewAI Cloud account
3. **Navigate to API Keys** section in your dashboard
4. **Generate a new API key**
5. **Copy and save** the key (it typically starts with `sk-`)

### Option 2: Use OpenAI Directly
If you prefer to use OpenAI's API directly (CrewAI supports multiple LLM backends):

1. **Visit**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Sign in** or create an account
3. **Create a new API key**
4. **Copy and save** the key (starts with `sk-`)

> **Note**: You'll need to configure CrewAI to use OpenAI in your Lambda code if you go this route.

---

## Using the Credentials

### During CDK Deployment
The current setup uses **placeholder values** in the stack:
```typescript
const appSecrets = new AppSecrets(this, 'AppSecrets', {
  telegramBotToken: 'REPLACE_WITH_REAL_TOKEN',
  crewAiApiKey: 'REPLACE_WITH_REAL_KEY',
});
```

These placeholders will create the secrets in AWS Secrets Manager, but you'll need to update them manually.

### After Deployment (Manual Update)

1. **Go to AWS Secrets Manager Console**
2. **Find your secrets**:
   - `cryptonaut/telegram-bot`
   - `cryptonaut/crewai-key`
3. **For each secret**:
   - Click "Retrieve secret value"
   - Click "Edit"
   - Update the JSON with your real credentials:
     ```json
     {"token": "YOUR_REAL_TELEGRAM_TOKEN"}
     ```
     ```json
     {"key": "YOUR_REAL_CREWAI_KEY"}
     ```
   - Save changes

### Alternative: Update Stack Before Deployment

You can also update the `cryptonaut-stack.ts` file directly before deploying:

```typescript
const appSecrets = new AppSecrets(this, 'AppSecrets', {
  telegramBotToken: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
  crewAiApiKey: 'sk-your-actual-key-here',
});
```

> **⚠️ Security Warning**: Never commit real credentials to version control! Use environment variables or AWS Systems Manager Parameter Store for production deployments.

---

## Next Steps

Once you have both credentials:
1. Update the secrets in AWS (or the stack file)
2. Deploy with `cdk deploy`
3. Test your Lambda functions
4. Set up the Telegram webhook to point to your API Gateway endpoint
