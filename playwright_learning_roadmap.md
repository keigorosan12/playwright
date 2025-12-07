# Playwright 学習ロードマップ

このドキュメントでは、Playwrightを効率的に学習し、実践的なE2Eテストスキルを習得するためのステップバイステップガイドを提供します。

## 1. Playwrightとは
Playwrightは、Microsoftが開発している最新のE2E（End-to-End）テストフレームワークです。
*   **高速で堅牢**: 待機処理（Auto-waiting）が強力で、テストが壊れにくい（Flakyになりにくい）。
*   **クロスブラウザ**: Chromium, Firefox, WebKitを単一のAPIでサポート。
*   **多言語対応**: TypeScript/JavaScript, Python, .NET, Javaで記述可能（本ガイドではTypeScriptを使用）。

## 2. 環境構築 (Setup)

まずは学習用の環境を整えます。

### 前提条件
*   Node.js (LTS版推奨) がインストールされていること。

### プロジェクトの初期化
VS Codeのターミナルで以下のコマンドを実行し、Playwrightプロジェクトを作成します。

```bash
npm init playwright@latest
```

セットアップ中の質問には以下のように回答することをお勧めします（学習用）：
*   **Do you want to use TypeScript or JavaScript?**: `TypeScript`
*   **Where to put your end-to-end tests?**: `tests` (デフォルト)
*   **Add a GitHub Actions workflow?**: `false` (学習段階では不要、後で追加可能)
*   **Install Playwright browsers?**: `true`

### ディレクトリ構成の理解
インストールが完了すると、以下のようなファイルが生成されます。
*   `tests/`: テストファイルを格納する場所。`example.spec.ts` が生成されます。
*   `playwright.config.ts`: Playwright全体の設定ファイル。
*   `package.json`: 依存関係の定義。

## Step 1: ノンコーディングでのテスト作成 (Codegen)
Playwrightの強力な機能「Codegen」を使って、コードを書かずにテストを作成してみましょう。

1.  **Codegenの起動**:
    ```bash
    npx playwright codegen demo.playwright.dev/todomvc
    ```
    ※ URLはテストしたいサイトに変更可能です。

2.  **ブラウザ操作**:
    立ち上がったブラウザでクリックや入力を行うと、Playwright Inspectorウィンドウにコードが自動生成されます。

3.  **コードの保存**:
    生成されたコードをコピーし、`tests/test-1.spec.ts` などの新規ファイルに貼り付けます。

4.  **テストの実行**:
    ```bash
    npx playwright test test-1.spec.ts
    ```

## Step 2: テストコードの基礎 (Basics)
生成されたコードを読み解き、自分で書けるようになりましょう。

### 基本構造
```typescript
import { test, expect } from '@playwright/test';

test('テストのタイトル', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```
*   `test`: テストケースを定義する関数。
*   `expect`: アサーション（検証）を行う関数。
*   `page`: ブラウザのタブやページを操作するオブジェクト（Fixture）。

### Locators (要素の特定)
推奨される特定方法は「ユーザーに見える属性」を使うことです。
*   `page.getByRole('button', { name: 'Submit' })`
*   `page.getByText('Welcome')`
*   `page.getByLabel('User Name')`

### Assertions (検証)
*   `await expect(locator).toBeVisible()`: 要素が表示されているか
*   `await expect(locator).toHaveText('Success')`: テキストが含まれるか
*   `await expect(locator).toBeEnabled()`: 操作可能か

## Step 3: デバッグとレポート (Debugging)
テストが失敗したときの対処法を学びます。

### UI Mode
開発中に最も便利なモードです。タイムトラベルデバッグが可能です。
```bash
npx playwright test --ui
```

### Trace Viewer
CIなどで失敗したテストの詳細な記録（Trace）を確認します。
`playwright.config.ts` で `trace: 'on-first-retry'` などを設定しておくと便利です。

### HTMLレポート
テスト実行後にレポートを表示します。
```bash
npx playwright show-report
```

## Step 4: 実践的な運用 (Advanced)

### スクリーンショットとビデオ
スクリーンショットを撮るコマンド：
```typescript
await page.screenshot({ path: 'screenshot.png' });
```
設定ファイルで自動取得の設定も可能です。

### 設定のカスタマイズ (`playwright.config.ts`)
*   `baseURL`: テスト対象の基本URLを設定し、`page.goto('/')` のように短縮して書けるようにする。
*   `projects`: モバイルビューポートのエミュレーション設定など。

## Step 5: CI/CD連携 (GitHub Actions)
テストをGitHub Actionsで自動実行するように設定します。

### ワークフローファイルの作成
`.github/workflows/playwright.yml` を作成し、PushやPull Requestのタイミングでテストが走るようにします。

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### 結果の確認
GitHubのリポジトリの「Actions」タブから、実行結果とHTMLレポート（Artifacts）を確認できます。

---

## 次のアクション
まずは `npm init playwright@latest` を実行して、サンプルテスト `example.spec.ts` を動かしてみましょう！
