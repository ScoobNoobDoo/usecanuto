"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AdminImageThumb from "@/components/admin/AdminImageThumb";
import { uploadImageFiles, IMAGE_ACCEPT } from "@/lib/upload-client";

const STEPS = [
  { id: 1, label: "Novo Anúncio", desc: "Iniciar cadastro" },
  { id: 2, label: "Título", desc: "Nome da peça" },
  { id: 3, label: "Categoria", desc: "Tipo da peça" },
  { id: 4, label: "Tamanhos", desc: "Opções disponíveis" },
  { id: 5, label: "Cores", desc: "Variações de cor" },
  { id: 6, label: "Imagens", desc: "Fotos do produto" },
  { id: 7, label: "Descrição", desc: "Detalhes da peça" },
  { id: 8, label: "Preço", desc: "Valor de venda" },
];

type DbCategory = { id: string; name: string; slug: string };

const DEFAULT_SIZES = ["PP", "P", "M", "G", "GG"];
const DEFAULT_COLORS = ["Preto", "Branco", "Bege", "Navy"];

export default function AdminWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as string[],
    description: "",
    price: "",
    salePrice: "",
    categoryId: "",
    featured: false,
  });
  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  const update = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const input = e.target;
    setUploading(true);
    setUploadError("");

    try {
      const { urls, error } = await uploadImageFiles(files);
      if (urls.length) {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      }
      if (error) setUploadError(error);
      else if (!urls.length) setUploadError("Nenhuma imagem foi enviada.");
    } catch {
      setUploadError("Falha no upload. Tente novamente.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const canProceed = () => {
    switch (step) {
      case 2: return form.title.trim().length > 0;
      case 3: return form.categoryId.length > 0;
      case 4: return form.sizes.length > 0;
      case 5: return form.colors.length > 0;
      case 6: return form.images.length > 0;
      case 7: return form.description.trim().length > 0;
      case 8: return parseFloat(form.price) > 0;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || null,
          price: parseFloat(form.price),
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Erro ao publicar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-10 overflow-x-auto scrollbar-hide pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-300 ${
                  step > s.id
                    ? "bg-accent text-white"
                    : step === s.id
                    ? "bg-foreground text-background"
                    : "bg-border text-muted"
                }`}
                animate={step === s.id ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {step > s.id ? <Check size={14} /> : s.id}
              </motion.div>
              <span className="text-[10px] mt-1 text-muted hidden sm:block whitespace-nowrap">
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 sm:w-10 h-px mx-1 transition-colors duration-300 ${
                  step > s.id ? "bg-accent" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white border border-border p-6 sm:p-10 min-h-[400px]"
        >
          {step === 1 && (
            <div className="text-center py-12">
              <ImageIcon size={48} strokeWidth={1} className="mx-auto text-accent mb-6" />
              <h2 className="font-serif text-2xl tracking-wide mb-3">Criar Novo Anúncio</h2>
              <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                Siga as etapas para cadastrar uma nova peça na loja. Você poderá
                adicionar título, categoria, tamanhos, cores, imagens, descrição e preço.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-xl tracking-wide mb-1">Título da Roupa</h2>
              <p className="text-sm text-muted mb-6">Como a peça será exibida na loja</p>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ex: Vestido Midi GGT Decote Metal"
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-xl tracking-wide mb-1">Categoria</h2>
              <p className="text-sm text-muted mb-6">
                Escolha onde a peça aparecerá na loja (Vestidos, Blusas, etc.)
              </p>
              {categories.length === 0 ? (
                <p className="text-sm text-muted">Carregando categorias...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => update("categoryId", cat.id)}
                      className={`px-4 py-2 text-sm border transition-all duration-200 ${
                        form.categoryId === cat.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
              {selectedCategory && (
                <p className="text-xs text-muted mt-3">
                  A peça será listada em: {selectedCategory.name}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-serif text-xl tracking-wide mb-1">Tamanhos</h2>
              <p className="text-sm text-muted mb-6">Selecione os tamanhos disponíveis</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {DEFAULT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => update("sizes", toggleItem(form.sizes, size))}
                    className={`px-4 py-2 text-sm border transition-all duration-200 ${
                      form.sizes.includes(size)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="Tamanho personalizado"
                  className="flex-1 border border-border px-4 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                <button
                  onClick={() => {
                    if (customSize.trim()) {
                      update("sizes", [...form.sizes, customSize.trim()]);
                      setCustomSize("");
                    }
                  }}
                  className="px-4 py-2 bg-cream text-sm hover:bg-border transition-colors"
                >
                  Adicionar
                </button>
              </div>
              {form.sizes.length > 0 && (
                <p className="text-xs text-muted mt-3">
                  Selecionados: {form.sizes.join(", ")}
                </p>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-serif text-xl tracking-wide mb-1">Cores</h2>
              <p className="text-sm text-muted mb-6">Selecione as cores disponíveis</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => update("colors", toggleItem(form.colors, color))}
                    className={`px-4 py-2 text-sm border transition-all duration-200 ${
                      form.colors.includes(color)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="Cor personalizada"
                  className="flex-1 border border-border px-4 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                <button
                  onClick={() => {
                    if (customColor.trim()) {
                      update("colors", [...form.colors, customColor.trim()]);
                      setCustomColor("");
                    }
                  }}
                  className="px-4 py-2 bg-cream text-sm hover:bg-border transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="font-serif text-xl tracking-wide mb-1">Imagens</h2>
              <p className="text-sm text-muted mb-6">Adicione fotos do produto</p>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border p-10 cursor-pointer hover:border-accent transition-colors duration-300 group">
                <input
                  type="file"
                  accept={IMAGE_ACCEPT}
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
                {uploading ? (
                  <Loader2 size={32} className="animate-spin text-accent" />
                ) : (
                  <>
                    <Upload
                      size={32}
                      strokeWidth={1.5}
                      className="text-muted group-hover:text-accent transition-colors"
                    />
                    <span className="text-sm text-muted mt-3">
                      Clique para adicionar imagens
                    </span>
                    <span className="text-xs text-muted/60 mt-1">
                      Galeria ou arquivos — JPG, PNG, WebP (máx. 5MB)
                    </span>
                  </>
                )}
              </label>

              {uploadError && (
                <p className="text-xs text-sale mt-3">{uploadError}</p>
              )}

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-6">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square bg-cream group">
                      <AdminImageThumb src={img} />
                      <button
                        onClick={() =>
                          update(
                            "images",
                            form.images.filter((_, idx) => idx !== i)
                          )
                        }
                        className="absolute top-1 right-1 w-5 h-5 bg-sale text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="font-serif text-xl tracking-wide mb-1">Descrição</h2>
              <p className="text-sm text-muted mb-6">
                Breve descrição que o cliente verá ao clicar na imagem
              </p>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Descreva o tecido, caimento, composição e detalhes da peça..."
                rows={8}
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none leading-relaxed"
                autoFocus
              />
              <p className="text-xs text-muted mt-2">
                {form.description.length} caracteres
              </p>
            </div>
          )}

          {step === 8 && (
            <div>
              <h2 className="font-serif text-xl tracking-wide mb-1">Preço</h2>
              <p className="text-sm text-muted mb-6">Defina o valor de venda</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted">Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="0,00"
                    className="w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted">
                    Preço promocional (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.salePrice}
                    onChange={(e) => update("salePrice", e.target.value)}
                    placeholder="0,00"
                    className="w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => update("featured", e.target.checked)}
                    className="accent-foreground"
                  />
                  <span className="text-sm">Destacar na página inicial</span>
                </label>
              </div>

              <div className="mt-8 p-4 bg-cream text-sm space-y-1">
                <p className="font-medium">{form.title}</p>
                <p className="text-muted text-xs">
                  {selectedCategory?.name || "Sem categoria"} · {form.sizes.join(" · ")} · {form.colors.join(" · ")}
                </p>
                <p className="text-accent">
                  R$ {parseFloat(form.price || "0").toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-1 px-5 py-2.5 text-sm tracking-wider uppercase border border-border hover:bg-cream transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>

        {submitError && (
          <p className="text-sm text-sale text-center mt-4">{submitError}</p>
        )}

        {step < 8 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-1 px-5 py-2.5 text-sm tracking-wider uppercase bg-foreground text-background hover:bg-accent transition-colors disabled:opacity-30"
          >
            Próximo
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm tracking-wider uppercase bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-30"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Publicar Anúncio
          </button>
        )}
      </div>
    </div>
  );
}