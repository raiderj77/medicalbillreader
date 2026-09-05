import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir:'tests/browser',workers:1,retries:0,timeout:45000,reporter:'line',use:{baseURL:'http://127.0.0.1:4314',trace:'off',screenshot:'off',video:'off'},webServer:{command:'npm run start -- --hostname 127.0.0.1 --port 4314',url:'http://127.0.0.1:4314',reuseExistingServer:false} });
