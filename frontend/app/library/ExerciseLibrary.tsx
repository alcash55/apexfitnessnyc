'use client';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

import { Fragment, useDeferredValue, useMemo, useState } from 'react';
import type { Exercise } from '@/lib/exercises';

/** Display grouping for the movement-pattern board; every pattern appears once. */
const PATTERN_FAMILIES: { name: string; patterns: string[] }[] = [
  {
    name: 'Push & pull',
    patterns: ['Horizontal Push', 'Vertical Push', 'Horizontal Pull', 'Vertical Pull'],
  },
  { name: 'Lower body', patterns: ['Squat', 'Hinge', 'Lunge', 'Carry'] },
  { name: 'Core', patterns: ['Core Flexion', 'Core Stability', 'Rotation'] },
  { name: 'Accessory & conditioning', patterns: ['Isolation', 'Power', 'Cardio', 'Mobility'] },
];

type Filters = { pattern: string; bodyPart: string; category: string; equipment: string };
const NO_FILTERS: Filters = { pattern: '', bodyPart: '', category: '', equipment: '' };

function countBy(list: Exercise[], key: (e: Exercise) => string | null) {
  const counts = new Map<string, number>();
  for (const e of list) {
    const k = key(e);
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

export default function ExerciseLibrary({
  exercises,
  patternDescriptions,
}: {
  exercises: Exercise[];
  patternDescriptions: Record<string, string>;
}) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(
    () => ({
      pattern: countBy(exercises, (e) => e.pattern),
      bodyPart: countBy(exercises, (e) => e.bodyPart),
      category: countBy(exercises, (e) => e.category),
      equipment: countBy(exercises, (e) => e.equipment),
    }),
    [exercises],
  );

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return exercises.filter(
      (e) =>
        (!filters.pattern || e.pattern === filters.pattern) &&
        (!filters.bodyPart || e.bodyPart === filters.bodyPart) &&
        (!filters.category || e.category === filters.category) &&
        (!filters.equipment || e.equipment === filters.equipment) &&
        (!q || e.name.toLowerCase().includes(q) || e.target.toLowerCase().includes(q)),
    );
  }, [exercises, filters, deferredQuery]);

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const select = (key: Exclude<keyof Filters, 'pattern'>, id: string, label: string) => (
    <NativeSelect
      unstyled
      id={id}
      aria-label={label}
      className="min-w-0 bg-black text-cream [border:1px_solid_var(--border)] py-[0.6rem] px-3 [font-family:inherit] text-[0.9rem] [font-weight:inherit] [font-style:inherit] [font-variant:inherit] [font-stretch:inherit] [line-height:inherit] flex-[1_1_150px] capitalize focus-visible:[outline:2px_solid_var(--gold)] focus-visible:outline-offset-[2px]"
      value={filters[key]}
      onChange={(ev) => setFilter(key, ev.target.value)}
    >
      <NativeSelectOption unstyled value="">
        All {label.toLowerCase()}
      </NativeSelectOption>
      {[...counts[key].entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([value, n]) => (
          <NativeSelectOption unstyled key={value} value={value}>
            {value} ({n})
          </NativeSelectOption>
        ))}
    </NativeSelect>
  );

  return (
    <div className="grid grid-cols-[minmax(0,_1fr)] gap-10">
      <header>
        <div className="section-label">Members only</div>
        <h1 className="section-h2">Exercise Library</h1>
        <p className="section-sub">
          Every exercise in the APEX catalog, sorted by body part, workout category and movement
          pattern. Pick a movement pattern or use the filters, then open any exercise to read its
          instructions.
        </p>
        <div className="flex flex-wrap gap-[0.5rem_1.5rem] mt-5 font-condensed text-[0.95rem] tracking-[0.1em] uppercase text-muted [&_b]:font-display [&_b]:font-normal [&_b]:text-[1.7rem] [&_b]:text-cream [&_b]:mr-[0.4rem] [&_b]:tabular-nums">
          <span>
            <b>{exercises.length.toLocaleString()}</b>exercises
          </span>
          <span>
            <b>{counts.bodyPart.size}</b>body parts
          </span>
          <span>
            <b>{counts.category.size}</b>categories
          </span>
          <span>
            <b>{counts.pattern.size}</b>movement patterns
          </span>
        </div>
      </header>

      <section aria-labelledby="patterns-heading">
        <h2
          id="patterns-heading"
          className="font-condensed font-bold text-[0.85rem] tracking-[0.18em] uppercase text-muted mb-4"
        >
          Movement patterns
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(min(240px,_100%),_1fr))] gap-4">
          {PATTERN_FAMILIES.map((family) => (
            <div key={family.name} className="grid gap-[0.35rem] [align-content:start]">
              <div className="font-condensed font-bold text-[0.75rem] tracking-[0.18em] uppercase text-gold pb-2 [border-bottom:1px_solid_var(--border)]">
                {family.name}
              </div>
              {family.patterns.map((p) => (
                <Button
                  variant="unstyled"
                  key={p}
                  type="button"
                  className="group/pattern grid grid-cols-[1fr_auto] items-baseline gap-3 w-full py-[0.55rem] px-3 text-left [background:transparent] [border:1px_solid_transparent] text-text text-[0.9rem] [transition:background_0.15s,_border-color_0.15s] [&:hover]:bg-charcoal [&[aria-pressed=true]]:bg-gold-dim [&[aria-pressed=true]]:[border-color:rgba(200,_168,_75,_0.45)] [&[aria-pressed=true]]:text-cream focus-visible:[outline:2px_solid_var(--gold)] focus-visible:outline-offset-[2px] motion-reduce:[transition:none]"
                  aria-pressed={filters.pattern === p}
                  onClick={() => setFilter('pattern', filters.pattern === p ? '' : p)}
                >
                  <span>{p}</span>
                  <span className="font-display text-[1.3rem] text-muted tabular-nums group-aria-pressed/pattern:text-gold">
                    {counts.pattern.get(p) ?? 0}
                  </span>
                </Button>
              ))}
            </div>
          ))}
        </div>
        <p className="min-h-[1.5em] mt-4 text-muted text-[0.9rem]">
          {filters.pattern
            ? `${filters.pattern}: ${patternDescriptions[filters.pattern] ?? ''}`
            : 'Select a pattern to filter the list. Select it again to show all patterns.'}
        </p>
      </section>

      <section aria-label="Exercises">
        <div className="flex flex-wrap gap-[0.6rem] p-[0.9rem] bg-charcoal [border:1px_solid_var(--border)] sticky top-nav z-[5]">
          <Input
            unstyled
            id="library-search"
            type="search"
            className="min-w-0 bg-black text-cream [border:1px_solid_var(--border)] py-[0.6rem] px-3 [font-family:inherit] text-[0.9rem] [font-weight:inherit] [font-style:inherit] [font-variant:inherit] [font-stretch:inherit] [line-height:inherit] flex-[2_1_220px] focus-visible:[outline:2px_solid_var(--gold)] focus-visible:outline-offset-[2px]"
            placeholder="Search exercises, e.g. deadlift"
            aria-label="Search exercises"
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
          />
          {select('bodyPart', 'library-body-part', 'Body parts')}
          {select('category', 'library-category', 'Categories')}
          {select('equipment', 'library-equipment', 'Equipment')}
          <Button
            variant="unstyled"
            type="button"
            className="flex-[0_0_auto] [background:transparent] text-gold [border:1px_solid_rgba(200,_168,_75,_0.45)] py-[0.6rem] px-4 font-condensed font-bold text-[0.85rem] tracking-[0.12em] uppercase [&:hover]:bg-gold-dim focus-visible:[outline:2px_solid_var(--gold)] focus-visible:outline-offset-[2px]"
            onClick={() => {
              setFilters(NO_FILTERS);
              setQuery('');
            }}
          >
            Clear filters
          </Button>
        </div>

        <div className="flex flex-wrap justify-between gap-2 my-3 mx-[0.15rem] text-muted text-[0.85rem] tabular-nums [&_strong]:text-cream">
          <span>
            <strong>{visible.length.toLocaleString()}</strong> of{' '}
            {exercises.length.toLocaleString()} exercises
          </span>
          <span>Select a row to see instructions</span>
        </div>

        <div className="overflow-x-auto [border:1px_solid_var(--border)]">
          <Table
            unstyled
            className="w-full min-w-[760px] border-collapse text-[0.9rem] [&_th]:text-left [&_th]:py-[0.7rem] [&_th]:px-[0.9rem] [&_th]:[border-bottom:1px_solid_var(--border)] [&_th]:align-top [&_th]:font-condensed [&_th]:font-bold [&_th]:text-[0.75rem] [&_th]:tracking-button [&_th]:uppercase [&_th]:text-muted [&_th]:bg-charcoal [&_th]:whitespace-nowrap [&_td]:text-left [&_td]:py-[0.7rem] [&_td]:px-[0.9rem] [&_td]:[border-bottom:1px_solid_var(--border)] [&_td]:align-top"
          >
            <TableHeader unstyled>
              <TableRow unstyled>
                <TableHead unstyled>Exercise</TableHead>
                <TableHead unstyled>Body part</TableHead>
                <TableHead unstyled>Target</TableHead>
                <TableHead unstyled>Category</TableHead>
                <TableHead unstyled>Movement pattern</TableHead>
                <TableHead unstyled>Equipment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody unstyled>
              {visible.map((e) => {
                const isOpen = openId === e.id;
                const toggle = () => setOpenId(isOpen ? null : e.id);
                return (
                  <Fragment key={e.id}>
                    <TableRow
                      unstyled
                      className="group/exercise focus-visible:[outline:2px_solid_var(--gold)] focus-visible:outline-offset-[2px] cursor-pointer [&:hover_td]:[background:rgba(240,_235,_224,_0.03)]"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onClick={toggle}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                          ev.preventDefault();
                          toggle();
                        }
                      }}
                    >
                      <TableCell
                        unstyled
                        className="text-cream font-medium capitalize before:content-['+'] before:inline-block before:w-4 before:text-gold before:font-bold group-aria-expanded/exercise:before:content-['−']"
                      >
                        {e.name}
                      </TableCell>
                      <TableCell unstyled className="capitalize">
                        {e.bodyPart}
                      </TableCell>
                      <TableCell unstyled className="capitalize">
                        {e.target}
                      </TableCell>
                      <TableCell unstyled>
                        {e.category ?? <span className="text-muted">None</span>}
                      </TableCell>
                      <TableCell unstyled>
                        <span className="inline-block py-[0.2rem] px-[0.55rem] bg-gold-dim text-gold font-condensed font-bold text-[0.8rem] tracking-logo uppercase whitespace-nowrap">
                          {e.pattern}
                        </span>
                      </TableCell>
                      <TableCell unstyled className="capitalize">
                        {e.equipment}
                      </TableCell>
                    </TableRow>
                    {isOpen && (
                      <TableRow
                        unstyled
                        className="[&_td]:bg-card [&_td]:p-[1rem_1rem_1.25rem_1.9rem] [&_p]:max-w-[75ch] [&_p]:leading-[1.7] [&_p_+_p]:mt-2"
                      >
                        <TableCell unstyled colSpan={6}>
                          <p>
                            {e.instructions ?? (
                              <span className="text-muted">No instructions yet.</span>
                            )}
                          </p>
                          {e.secondary.length > 0 && (
                            <p>
                              <span className="font-condensed font-bold text-[0.75rem] tracking-button uppercase text-gold mr-2">
                                Also works
                              </span>
                              {e.secondary.join(', ')}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
          {visible.length === 0 && (
            <div className="py-10 px-4 text-center text-muted">
              No exercises match these filters. Clear a filter or try a shorter search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
