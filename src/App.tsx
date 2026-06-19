import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { EvaluatePage } from "./pages/EvaluatePage";
import { ReportPage } from "./pages/ReportPage";
import { ExamplesPage } from "./pages/ExamplesPage";
import { PromptPreviewPage } from "./pages/PromptPreviewPage";
import { JsonPreviewPage } from "./pages/JsonPreviewPage";
import { GeneratedReportPreviewPage } from "./pages/GeneratedReportPreviewPage";
import { GeminiPocPage } from "./pages/GeminiPocPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/evaluate" element={<EvaluatePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/report/generated-preview" element={<GeneratedReportPreviewPage />} />
        <Route path="/report/:reportId" element={<ReportPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="/prompt-preview" element={<PromptPreviewPage />} />
        <Route path="/json-preview" element={<JsonPreviewPage />} />
        <Route path="/gemini-poc" element={<GeminiPocPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
