import Amplify, { Interactions } from 'aws-amplify';

Amplify.configure({
    Auth: {
        identityPoolId: 'eu-west-1:a558f16d-ae65-443d-bceb-bd30aa394341',
        region: 'eu-west-1',
    },
    Interactions: {
        bots: {
            "YourLexBotName": {
                "name": "YourLexBotName",
                "alias": "YourBotAlias",
                "region": "YOUR_AWS_REGION",
            },
        },
    },
});
