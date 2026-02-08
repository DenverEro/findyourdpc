
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';

interface BlogPostViewProps {
  blogs: BlogPost[];
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ blogs }) => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    let found = null;
    if (slug) {
      found = blogs.find(b => b.slug === slug);
    } else if (id) {
      found = blogs.find(b => b.id === id);
    }

    if (found) {
      setBlog(found);
    }
    window.scrollTo(0, 0);
  }, [slug, id, blogs]);

  if (!blog) return <div className="p-20 text-center">Article not found.</div>;

  // Render content based on ID - specific rendering for the long-form Michigan article
  const isMichiganArticle = blog.id === 'b-michigan-rates';

  return (
    <article className="bg-white min-h-screen pb-24">
      {/* Article Header with Parallax-style background */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={blog.image} className="w-full h-full object-cover" alt={blog.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-black/20"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-emerald-700 font-bold mb-6 hover:text-emerald-900 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl transition shadow-sm">
              <i className="fas fa-arrow-left mr-2 text-sm"></i> Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                {blog.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              {blog.title}
            </h1>
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xl mr-4 shadow-inner border border-emerald-200">
                {blog.author.charAt(0)}
              </div>
              <div>
                <div className="text-slate-900 font-black text-lg">{blog.author}</div>
                <div className="text-slate-500 font-medium">Policy Analysis & Patient Advocacy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16">
        {isMichiganArticle ? (
          <div className="space-y-12 text-slate-700 leading-relaxed text-lg md:text-xl">
            {/* Key Takeaways Section */}
            <div className="bg-emerald-50 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-sm">
              <h2 className="text-2xl font-black text-emerald-800 mb-4 flex items-center gap-3">
                <i className="fas fa-lightbulb"></i> Key Takeaways
              </h2>
              <p className="text-emerald-900 font-medium leading-relaxed">
                <strong>Blue Cross Blue Shield of Michigan raised rates by 24% in 2026</strong>, and Priority Health by 19.2%—the highest increases since 2010. The culprit? Federal enhanced ACA tax credits expired on January 1, 2026, triggering a <strong>40,000-person exodus</strong> from the Michigan marketplace. For a 60-year-old earning $63,000, monthly premiums jumped from $287 to $740—a brutal <strong>158% overnight increase</strong>. But there's an alternative: <strong>Direct Primary Care (DPC) costs $65-$85/month</strong> in Michigan, and when paired with a high-deductible HSA plan, delivers better access to doctors at half the cost of traditional insurance.
              </p>
            </div>


            <hr className="border-slate-100" />

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 font-primary">Why Did Michigan Health Insurance Rates Jump 20% in 2026?</h2>
              <p className="mb-6">
                If your health insurance premium doubled, tripled, or worse this year, you're not imagining things. You're living through what frustrated Michiganders are calling the <strong>"One Big Beautiful Bill" crisis</strong>—a perfect storm of expired federal subsidies, hospital monopolies, and insurance carriers fleeing the marketplace.
              </p>
              <p className="mb-6">
                Here's the stark reality: According to the <a href="https://www.michigan.gov/difs/-/media/Project/Websites/difs/OIRF/EHB/PDFs/2026_Approved_Rate_Changes.pdf" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold"><strong>Michigan Department of Insurance and Financial Services (DIFS)</strong> official rate filing data</a>, <strong>Blue Cross Blue Shield of Michigan (BCBSM) approved a 24.0% rate increase for 2026</strong>, impacting 56,689 individual market enrollees. Priority Health followed with a 19.2% hike affecting 121,940 people. Across Michigan, the average individual market increase hit <strong>20.2%</strong>—the steepest jump in over a decade.
              </p>
              <p className="mb-8">
                But the percentage doesn't tell the full story. According to <a href="https://www.healthinsurance.org/aca-marketplace/michigan/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold"><strong>HealthInsurance.org</strong></a> and <a href="https://bridgemi.com/michigan-health-watch/michigan-open-enrollment-heres-how-much-health-insurance-rates-are-rising/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold"><strong>Bridge Michigan</strong> analyses</a>, when federal enhanced premium tax credits expired on December 31, 2025, the actual monthly cost for Michigan families skyrocketed:
              </p>

              <div className="bg-slate-50 p-8 rounded-3xl mb-12 border border-slate-100">
                <ul className="space-y-4 text-slate-600">
                  <li className="flex items-start gap-3">
                    <i className="fas fa-arrow-up text-red-500 mt-1"></i>
                    <span>A <strong>40-year-old earning $40,000</strong> in Detroit went from paying <strong>$78/month to $128/month</strong> (64% increase)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-arrow-up text-red-500 mt-1"></i>
                    <span>A <strong>60-year-old earning $63,000</strong> saw premiums explode from <strong>$287/month to $740/month</strong>—a <strong>$453 monthly jump</strong> (158% increase)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-arrow-up text-red-500 mt-1"></i>
                    <span>A <strong>60-year-old couple earning $85,000</strong> faced an increase from <strong>$7,225/year to $26,758/year</strong>—nearly <strong>$20,000 more annually</strong> (270% increase)</span>
                  </li>
                </ul>
                <p className="mt-6 font-bold text-slate-900 italic">That's not a rate increase. That's a policy earthquake.</p>
              </div>
            </section>


            {/* Cost Highlight Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="text-emerald-400 font-black mb-2">The Old Way</div>
                  <div className="text-4xl font-black mb-2">$740/mo</div>
                  <div className="text-slate-400 text-sm">60-year-old earning $63k</div>
                  <div className="mt-6 flex items-center gap-2 text-red-400 font-bold">
                    <i className="fas fa-clock"></i> 90+ Day Wait Times
                  </div>
                </div>
                <i className="fas fa-hospital absolute -right-4 -bottom-4 text-white/5 text-[10rem] rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
              </div>
              <div className="bg-emerald-600 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="text-white/80 font-black mb-2">The DPC Way</div>
                  <div className="text-4xl font-black mb-2">$80/mo</div>
                  <div className="text-white/80 text-sm">Standard Michigan DPC Fee</div>
                  <div className="mt-6 flex items-center gap-2 text-white font-bold">
                    <i className="fas fa-bolt"></i> Same-Day Access
                  </div>
                </div>
                <i className="fas fa-stethoscope absolute -right-4 -bottom-4 text-white/10 text-[10rem] -rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-12">
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">Traditional Insurance vs. DPC Alternative</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4 font-bold">Plan Type</th>
                      <th className="px-6 py-4 font-bold">Monthly Cost</th>
                      <th className="px-6 py-4 font-bold">Annual Cost</th>
                      <th className="px-6 py-4 font-bold">Doctor Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900"><strong>Traditional Silver Plan (BCBS)</strong></td>
                      <td className="px-6 py-4">$740/month</td>
                      <td className="px-6 py-4">$8,880/year</td>
                      <td className="px-6 py-4 text-red-500 font-medium">90+ day waits</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="px-6 py-4 font-bold text-emerald-700"><strong>DPC + Catastrophic Plan</strong></td>
                      <td className="px-6 py-4">$330/month <span className="text-xs font-normal text-slate-500">($80 DPC + $250 HDHP)</span></td>
                      <td className="px-6 py-4">$3,960/year</td>
                      <td className="px-6 py-4 text-emerald-600 font-black">Same-day/next-day</td>
                    </tr>
                    <tr className="bg-emerald-600 text-white font-black">
                      <td className="px-6 py-4"><strong>Annual Savings with DPC</strong></td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">$4,920</td>
                      <td className="px-6 py-4">✓ Better access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-50 text-xs text-slate-500 italic">
                Note: As of January 1, 2026, DPC memberships are HSA-eligible thanks to <strong>Section 71308</strong> of federal legislation (the "One Big Beautiful Bill"), allowing for an additional 20-30% tax savings.
              </div>
            </div>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 font-primary">Why Is Michigan Health Insurance So Expensive?</h2>

              <div className="space-y-10">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">1</span>
                    The Federal Subsidy Cliff
                  </h3>
                  <p className="mb-4">
                    The primary driver is Congress's failure to extend enhanced Affordable Care Act tax credits. Roughly <strong>500,000 Michigan residents</strong> relied on these credits to afford coverage. When they expired, premiums returned to their true, unsubsidized cost—a cost most middle-class families simply cannot afford.
                  </p>
                  <p>
                    The subsidy structure created a perverse incentive: it masked the actual price of healthcare for years. Now that the mask is off, families earning between $40,000 and $85,000—the self-employed, freelancers, and small business owners—are trapped in what's known as the <strong>"subsidy cliff."</strong> They earn too much to qualify for meaningful help, but not enough to absorb a $500-$700 monthly premium increase.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">2</span>
                    Hospital Consolidation Driving Up Costs
                  </h3>
                  <p className="mb-4">
                    Michigan's hospital systems have been on a decade-long buying spree, and you're paying for it. According to the <a href="https://mihpc.org/the-healthcare-cost-crisis/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold"><strong>Michigan Health Purchasers Coalition</strong></a>, <strong>47 cents of every healthcare dollar</strong> now goes to hospital services—up from far less a decade ago.
                  </p>
                  <p>
                    When big health systems like Corewell and Trinity buy smaller hospitals, clinics, and doctor practices, they gain <strong>monopoly pricing power</strong>. According to <a href="https://bridgemi.com/michigan-health-watch/five-reasons-health-insurance-rates-are-rising-so-much-in-michigan/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold"><strong>Bridge Michigan</strong> reporting</a>, between 2010 and 2020 alone, Michigan payers saw a <strong>40% increase</strong> in hospital service costs. As one health coalition leader explained: "Big, corporate health systems take over and buy more hospitals and buy more doctors and buy more clinics … the prices just inevitably go up because they now have more market power."
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">3</span>
                    Four Major Insurers Exited Michigan's Marketplace
                  </h3>
                  <p>
                    According to <strong>Bridge Michigan</strong> and <strong>Michigan Democrats' healthcare analysis</strong>, Molina, HAP CareSource, Physician Health Plan/University of Michigan, and Meridian collectively abandoned Michigan's ACA marketplace for 2026, affecting <strong>over 200,000 enrollees</strong>. These exits force families to switch plans mid-treatment, lose their doctors, and scramble for coverage—often at higher prices.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">4</span>
                    Drug Costs and Provider Shortages
                  </h3>
                  <p>
                    According to <strong>Bridge Michigan's analysis of insurer rate filings</strong>, GLP-1 weight-loss drugs (Ozempic, Wegovy), gene therapies, and post-COVID utilization spikes are pushing pharmaceutical costs into the stratosphere. Meanwhile, according to the <strong>Michigan Primary Care Association</strong>, Michigan faces a <strong>shortage of primary care physicians</strong>, driving up wages and facility costs across the board.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">5</span>
                    Administrative Bloat
                  </h3>
                  <p>
                    According to physician advocacy groups cited by <strong>Bridge Michigan</strong>, healthcare managers now vastly outnumber actual doctors in Michigan, yet patients aren't seeing better outcomes—just higher bills. The lack of price transparency means you can't shop for better rates, giving hospitals even more leverage.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-sky-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fas fa-money-bill-wave text-[15rem] rotate-12"></i>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-6">What Is the Subsidy Cliff in Michigan?</h2>
                <p className="text-sky-100 mb-8 leading-relaxed">
                  Let's talk about who this hurts most.
                </p>
                <p className="text-sky-100 mb-8 leading-relaxed">
                  A <strong>25-year-old in Michigan's Upper Peninsula</strong> who currently pays less than $10/month with subsidies now faces unsubsidized premiums ranging from <strong>$380 to $1,000/month</strong>—a price increase that forces an impossible choice between health coverage and rent.
                </p>
                <p className="text-sky-100 mb-8 leading-relaxed">
                  Or consider the <strong>45-year-old Michigander earning $64,000</strong>—solidly middle-class by any measure—facing a <strong>$1,678/month premium</strong> without subsidies. That's more than most mortgages.
                </p>
                <p className="text-sky-100 mb-8 leading-relaxed text-lg font-bold">
                  This is the subsidy cliff in action: <strong>earn one dollar too much, and you lose thousands in assistance</strong>. You're punished for success. You're told you make "too much" to deserve help—while being unable to afford the help you no longer qualify for.
                </p>
                <div className="mt-10 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                  <p className="text-white mb-0">
                    According to <strong>CMS enrollment data</strong> analyzed by <strong>Bridge Michigan</strong> and <a href="https://www.michiganpublic.org/health/2026-01-05/michiganders-face-higher-health-insurance-premiums-this-new-year" target="_blank" rel="noopener noreferrer" className="text-white underline font-bold"><strong>Michigan Public Radio</strong></a>, an estimated <strong>40,000 Michiganders</strong> abandoned the ACA marketplace in 2026 compared to 2025—the largest single-year exodus in state history. They didn't magically get healthier or find better options. They simply <strong>couldn't afford it</strong> and went uninsured.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-6 font-primary">What Is Direct Primary Care in Michigan?</h2>
              <p className="mb-6">
                Here's what nobody in the traditional insurance system wants you to know: <strong>you don't need a $15,000 annual premium to see a doctor</strong>.
              </p>
              <p className="mb-8 leading-relaxed">
                Direct Primary Care (DPC) is a membership-based model where you pay your doctor directly—no insurance middleman, no claims, no billing codes. In Michigan, DPC practices charge between <strong>$65 and $85 per month</strong> for unlimited primary care visits, 24/7 text access to your doctor, same-day or next-day appointments, and deeply discounted lab work.
              </p>
              <p className="font-bold text-slate-900 mb-4">Here's the pricing breakdown at Michigan DPC practices:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { name: 'Red Cedar Direct Primary Care (Lansing)', p: '$65/month' },
                  { name: 'Dr. Jane Klaes Direct Primary Care (Ann Arbor)', p: '$79.99/month' },
                  { name: 'Plum Health DPC (Detroit/Lansing)', p: '$85/month' },
                  { name: 'Direct Primary Care of West Michigan (Grand Rapids)', p: '$75/month' }
                ].map(item => (
                  <div key={item.name} className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-emerald-500 transition-colors">
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-black text-sm">{item.p}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-900 font-bold italic">
                That's <strong>$780 to $1,020 per year</strong> for comprehensive primary care—less than what many Michiganders now pay for a <strong>single month</strong> of subsidized insurance.
              </p>
            </section>


            {/* FAQ Section */}
            <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">People Also Ask</h2>
              <div className="space-y-6">
                {[
                  { q: 'Is Direct Primary Care considered health insurance?', a: 'No. DPC is a direct payment arrangement for primary care. You still need some form of high-deductible or catastrophic insurance for major hospitalizations, cancer care, or surgeries.' },
                  { q: 'Can I use my HSA for DPC memberships?', a: 'Yes. As of January 1, 2026, federal law (Section 71308) allows HSA funds to pay for DPC memberships tax-free.' },
                  { q: 'What happens if I have an emergency or need surgery?', a: 'For emergencies, surgeries, or specialist care, you rely on your high-deductible insurance plan. DPC handles 90% of your day-to-day healthcare needs (flu, stitches, chronic disease management, physicals).' },
                  { q: 'Will this work if I have pre-existing conditions?', a: 'Yes. DPC practices do not discriminate based on health history. Your membership is a flat fee regardless of your medical complexity.' },
                  { q: 'Do I need to cancel my traditional insurance?', a: 'We recommend switching to a lower-cost Bronze or Catastrophic plan rather than cancelling insurance entirely. This protects you from bankruptcy in the event of a major medical event while saving you thousands on monthly premiums.' }
                ].map((faq, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex gap-2">
                      <i className="fas fa-question-circle text-emerald-500"></i> {faq.q}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-8 font-primary">How Much Does DPC Cost vs. Traditional Insurance in Michigan?</h2>
              <p className="mb-8 text-slate-600">
                The magic happens when you pair DPC with a <strong>high-deductible HSA plan</strong> (often called a catastrophic plan). Here's the math that's making thousands of Michiganders switch:
              </p>

              <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-8">
                <div className="p-6 bg-slate-900 text-white">
                  <h3 className="text-xl font-bold">Michigan Health Insurance Cost Comparison (2026)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500 bg-slate-50">
                        <th className="px-6 py-4 font-bold">Cost Category</th>
                        <th className="px-6 py-4 font-bold">Traditional ACA Plan</th>
                        <th className="px-6 py-4 font-bold">DPC + HSA Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 font-primary">Monthly Premium</td>
                        <td className="px-6 py-4">$740 <span className="text-xs text-slate-400 font-normal">(60-year-old, $63K income)</span></td>
                        <td className="px-6 py-4">$250 <span className="text-xs text-slate-400 font-normal">(catastrophic HDHP)</span></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 font-primary">Annual Premium</td>
                        <td className="px-6 py-4">$8,880</td>
                        <td className="px-6 py-4">$3,000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 font-primary">DPC Membership</td>
                        <td className="px-6 py-4">$0</td>
                        <td className="px-6 py-4">$960/year <span className="text-xs text-slate-400 font-normal">($80/mo)</span></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 font-primary">Deductible</td>
                        <td className="px-6 py-4">$7,500</td>
                        <td className="px-6 py-4">$7,000</td>
                      </tr>
                      <tr className="bg-emerald-50">
                        <td className="px-6 py-4 font-bold text-emerald-900 font-primary">Total Annual Cost (no major health events)</td>
                        <td className="px-6 py-4 text-emerald-900 font-bold">$8,880</td>
                        <td className="px-6 py-4 text-emerald-700 font-black">$3,960</td>
                      </tr>
                      <tr className="bg-emerald-600 text-white font-black text-lg">
                        <td className="px-6 py-4">Annual Savings</td>
                        <td className="px-6 py-4">—</td>
                        <td className="px-6 py-4">**$4,920**</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-6 text-slate-600">
                <p>
                  The DPC + HSA model saves you <strong>nearly $5,000 per year</strong> while giving you <strong>better access</strong> to your doctor. You're protected from catastrophic expenses (cancer, accidents, surgery) through the high-deductible plan, but you're getting your primary care—the 90% of healthcare most people actually use—for a fraction of the cost.
                </p>
                <p className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                  And here's the kicker: <strong>as of January 1, 2026, DPC memberships are HSA-eligible</strong> thanks to Section 71308 of federal legislation (commonly called the "One Big Beautiful Bill"). That means you can pay your DPC membership with pre-tax dollars, saving an additional 20-30% depending on your tax bracket.
                </p>
              </div>
            </section>

            {/* How to Switch */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-10 font-primary">How Do I Switch to Direct Primary Care in Michigan?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { s: 'Step 1', t: 'Find a Michigan DPC Practice', d: 'Visit practices like Plum Health DPC in Detroit/Lansing, Red Cedar Direct Primary Care in East Lansing, or Direct Primary Care of West Michigan in Grand Rapids. Most offer free consultations to explain how the model works.' },
                  { s: 'Step 2', t: 'Enroll in an HDHP', d: 'You need catastrophic coverage for emergencies. Look for Bronze or Catastrophic marketplace plans with deductibles around $7,000. These typically cost $150-$300/month—far less than comprehensive plans.' },
                  { s: 'Step 3', t: 'Open an HSA', d: 'Contribute up to $4,300 per year (2026 limit for individuals) tax-free. Use it to pay your DPC membership, deductible expenses, and qualified medical costs.' },
                ].map(step => (
                  <div key={step.s} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative group hover:border-emerald-500 transition-colors">
                    <div className="text-emerald-600 font-black text-sm uppercase mb-3 tracking-widest">{step.s}</div>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">{step.t}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <i className="fas fa-user-check text-[15rem]"></i>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-8 font-primary">Who Is This For?</h2>
                <p className="text-slate-400 mb-10 text-xl font-medium">The DPC + HSA model works best for:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-200">
                  {[
                    'Self-employed individuals and freelancers priced out of ACA marketplace plans',
                    'Small business owners looking to offer affordable healthcare without traditional group insurance',
                    'Families earning $50,000-$100,000 who fall into the subsidy cliff',
                    'Early retirees (ages 50-64) not yet eligible for Medicare but facing astronomical premiums',
                    'Anyone paying $500+ per month for insurance they rarely use due to high deductibles'
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center bg-white/5 p-5 rounded-2xl border border-white/10 group hover:border-emerald-500 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <i className="fas fa-check text-xs"></i>
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-12 text-slate-400 italic text-lg leading-relaxed border-t border-white/10 pt-8">
                  "If you currently have a $7,500+ deductible and 90-day appointment waits, you're already getting 'catastrophic-only' coverage—except you're paying comprehensive prices for it. DPC lets you pay for what you're actually getting."
                </p>
              </div>
            </section>


            {/* Bottom Line */}
            <section className="py-10">
              <h2 className="text-3xl font-black text-slate-900 mb-6 font-primary italic">The Bottom Line: You Have Options</h2>
              <p className="mb-6">
                Your Michigan health insurance didn't just "go up." It exploded because a federal subsidy system that masked the true cost of care collapsed overnight, leaving middle-class families holding the bag.
              </p>
              <p className="mb-10 p-8 bg-emerald-50 rounded-[2rem] border-2 border-dashed border-emerald-200 text-emerald-900 font-medium">
                For less than the cost of cable TV—<strong>$70 to $85 per month</strong>—you can have a doctor who knows your name, answers your texts, and sees you the same day you call. The system broke. But the solution is already here.
              </p>
            </section>

            {/* CTA Section */}
            <div className="bg-emerald-600 p-12 rounded-[3rem] text-center text-white shadow-2xl">
              <h3 className="text-3xl font-black mb-4">Reclaim Your Healthcare</h3>
              <p className="text-emerald-50 mb-10 max-w-xl mx-auto text-lg">Don't settle for expensive, inaccessible insurance. Find a Michigan DPC doctor today and start saving thousands.</p>
              <Link to="/directory" className="inline-block bg-white text-emerald-700 font-black px-10 py-5 rounded-2xl text-xl shadow-xl hover:bg-emerald-50 transition active:scale-95">
                Browse Michigan Directory
              </Link>
            </div>

            {/* Sources */}
            <footer className="pt-16 border-t border-slate-100">
              <h4 className="font-black text-slate-400 uppercase tracking-widest text-sm mb-6">Sources & Citations</h4>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li>• <a href="https://www.michigan.gov/difs/-/media/Project/Websites/difs/OIRF/EHB/PDFs/2026_Approved_Rate_Changes.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 hover:underline"><strong>Michigan Department of Insurance and Financial Services (DIFS)</strong> official 2026 rate filing data</a></li>
                <li>• <a href="https://bridgemi.com/michigan-health-watch/five-reasons-health-insurance-rates-are-rising-so-much-in-michigan/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 hover:underline"><strong>Bridge Michigan</strong> "Health Watch" reporting on rising costs</a></li>
                <li>• <a href="https://www.michiganpublic.org/health/2026-01-05/michiganders-face-higher-health-insurance-premiums-this-new-year" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 hover:underline"><strong>Michigan Public Radio</strong> coverage of the 2026 market exodus</a></li>
                <li>• <a href="https://mihpc.org/the-healthcare-cost-crisis/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 hover:underline"><strong>Michigan Health Purchasers Coalition</strong> - "The Healthcare Cost Crisis"</a></li>
                <li>• <a href="https://www.healthinsurance.org/aca-marketplace/michigan/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 hover:underline"><strong>HealthInsurance.org</strong> - Michigan ACA Marketplace Guide (2026)</a></li>
              </ul>
            </footer>
          </div>
        ) : (
          /* Default Post Rendering for other blog posts */
          <div className="space-y-12">
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-8 rounded-r-2xl">
              <p className="text-xl text-emerald-900 font-medium leading-relaxed">
                {blog.excerpt}
              </p>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
              {blog.content.split(/\d+\./).filter(Boolean).map((item, i) => (
                <div key={i} className="flex gap-6 mb-8 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-black text-lg">{i + 1}</span>
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed pt-2">
                    {item.trim()}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 text-white p-10 rounded-3xl">
              <h3 className="text-2xl font-black mb-4">Ready to learn more?</h3>
              <p className="text-slate-300 mb-6">
                Explore our directory of Direct Primary Care practices near you.
              </p>
              <Link to="/directory" className="inline-flex items-center bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition">
                Find a DPC Practice <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        )}

        {/* Post Footer Actions */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Share this Story</span>
            <div className="flex space-x-3">
              <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md transition">
                <i className="fab fa-facebook-f text-lg"></i>
              </button>
              <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-white hover:shadow-md transition">
                <i className="fab fa-twitter text-lg"></i>
              </button>
              <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-white hover:shadow-md transition">
                <i className="fas fa-link text-lg"></i>
              </button>
            </div>
          </div>
          <button className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition active:scale-95">
            <i className="fas fa-bookmark"></i>
            <span>Save for Later</span>
          </button>
        </div>
      </div>
    </article >
  );
};

export default BlogPostView;
