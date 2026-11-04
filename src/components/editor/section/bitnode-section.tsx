import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { FileContext } from "App";
import { Input } from "components/inputs/input";

const BITNODE_COUNT = 14;
const UNLIMITED_BITNODE = 8;

function getCompletions(sourceFiles: unknown, bitNodeN: number): number {
  if (Array.isArray(sourceFiles)) {
    return sourceFiles.find((sourceFile) => sourceFile.n === bitNodeN)?.lvl ?? 0;
  }

  const map = sourceFiles as { data?: [number, number][] } | undefined;
  return map?.data?.find((sourceFile) => sourceFile[0] === bitNodeN)?.[1] ?? 0;
}

function getMaxCompletions(bitNodeN: number): number | undefined {
  return bitNodeN === UNLIMITED_BITNODE ? undefined : 3;
}

export default observer(function BitNodeSection() {
  const { bitnode } = useContext(FileContext);
  const bitNodeN = bitnode.data.bitNodeN ?? 1;
  const completions = getCompletions(bitnode.data.sourceFiles, bitNodeN);

  const update = (nextBitNodeN: number, nextCompletions: number) => {
    if (!Number.isFinite(nextBitNodeN) || !Number.isFinite(nextCompletions)) return;
    bitnode.updateBitNode(
      Math.max(1, Math.floor(nextBitNodeN)),
      Math.max(0, Math.floor(nextCompletions))
    );
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="rounded border border-gray-700 shadow shadow-green-700 p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">BitNode</h2>
          <p className="text-sm text-gray-400">Choose the active BitNode and edit completion levels for every BitNode.</p>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-gray-300">Active BitNode</span>
          <Input
            type="number"
            min={1}
            step={1}
            value={bitNodeN}
            onChange={(event) => {
              const nextBitNodeN = Number(event.currentTarget.value);
              update(nextBitNodeN, getCompletions(bitnode.data.sourceFiles, nextBitNodeN));
            }}
          />
        </label>
        <div className="border-t border-gray-700 pt-4 flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-100">BitNode completions</h3>
            <span className="text-xs text-gray-500">Most BitNodes: max 3. BitNode 8: unlimited.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Array.from({ length: BITNODE_COUNT }, (_, index) => index + 1).map((node) => {
              const max = getMaxCompletions(node);
              return (
                <label className="flex items-center justify-between gap-3 rounded border border-gray-800 px-3 py-2" key={node}>
                  <span className="text-gray-300">BitNode {node}</span>
                  <Input
                    className="w-24"
                    type="number"
                    min={0}
                    max={max}
                    step={1}
                    value={getCompletions(bitnode.data.sourceFiles, node)}
                    onChange={(event) => {
                      const value = Number(event.currentTarget.value);
                      if (!Number.isFinite(value)) return;
                      const completions = Math.max(0, Math.floor(value));
                      bitnode.updateBitNodeCompletions(
                        node,
                        max === undefined ? completions : Math.min(max, completions)
                      );
                    }}
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});