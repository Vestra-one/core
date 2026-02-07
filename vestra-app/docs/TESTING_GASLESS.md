# Gasless (NEP-366) payments

Gasless is **optional**. The app uses it when both `VITE_RELAYER_URL` and `signDelegateActionForMetaTx` (e.g. FastAuth) are set; otherwise the user signs and pays gas.

**Relayer deploy and E2E testing:** see [relayer-deploy/README.md](../../relayer-deploy/README.md) (deploy, test scripts, API).
