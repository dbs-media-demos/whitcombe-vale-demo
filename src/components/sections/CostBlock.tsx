import { ButtonLink } from "@/components/ui/ButtonLink";
import { businessPackages, estatePackages, otherFees } from "@/content/fees";
import { defaultBiz } from "@/lib/biz";
import type { Biz } from "@/lib/biz-core";

const fee = (name: string) => otherFees.find((f) => f.name === name)!;

/** "What it costs", under the steps on phones: the fees page's headline figures. A preview makes no price claims for a real firm. */
export function CostBlock({ biz = defaultBiz }: { biz?: Biz }) {
  const rows = biz.preview
    ? [
        { name: "15-minute confidential call", value: "Free" },
        { name: "Strategy meeting (60 min)", value: "Credited to your fee" },
        { name: "Wills, business formation, contracts", value: "A flat fee, quoted first" },
        { name: "Contested family matters", value: "Hourly, with a written estimate" },
      ]
    : [
        fee("15-minute confidential call"),
        fee("Strategy meeting (60 min)"),
        { name: `${estatePackages[0].name} · ${businessPackages[0].name}`, value: `${estatePackages[0].price} · ${businessPackages[0].price}` },
        fee("Uncontested divorce"),
        fee("Contested family matters"),
      ];
  return (
    <div className="cost-block">
      <h3 className="t-display text-[1.7rem] leading-[1.05]">What it costs</h3>
      <dl className="mt-3 border-t border-line-strong">
        {rows.map((r) => (
          <div key={r.name} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-[0.92rem]">
            <dt className="text-muted">{r.name}</dt>
            <dd className="shrink-0 text-right text-brass-light max-w-[52%]">{r.value}</dd>
          </div>
        ))}
      </dl>
      {!biz.preview && (
        <ButtonLink href="/fees" variant="text" className="mt-4">
          All fees
        </ButtonLink>
      )}
    </div>
  );
}
