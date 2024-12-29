'use client';

import { Tooltip } from '@nextui-org/tooltip';
import { useEffect, useRef, useState } from 'react';
import { useFocusingTask } from '@/stores/useTasksStore';
import { useMode, useStatus } from '@/stores/useTimerStore';
import { RightArrow } from '../Icons';
import TaskSelector from './TaskSelector';

export default function FocusingTask() {
  const focusingTask = useFocusingTask();
  const status = useStatus();
  const mode = useMode();
  const [showSelector, setShowSelector] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const KeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSelector(false);
    };

    const clickHandler = () => {
      setShowSelector(false);
    };

    const wrapper = wrapperRef.current;

    if (showSelector) {
      document.addEventListener('keydown', KeyHandler);
      wrapper?.addEventListener('click', clickHandler);
    }

    return () => {
      document.removeEventListener('keydown', KeyHandler);
      wrapper?.removeEventListener('click', clickHandler);
    };
  }, [showSelector]);

  if (mode === 'break' || (!focusingTask && status === 'running')) {
    return <div />;
  }

  return (
    <div>
      <Tooltip
        showArrow
        color="secondary"
        placement="bottom"
        content={focusingTask ? focusingTask.name : 'Select a task'}
        aria-label="tooltip"
      >
        <button
          type="button"
          className={`${focusingTask ? 'text-white' : 'text-[#FFFFFFA0]'} transition-colors delay-300 select-none`}
          onClick={() => setShowSelector(true)}
        >
          <div className="relative flex justify-center items-center">
            <span className="truncate max-w-[10rem]">
              {focusingTask ? focusingTask.name : 'Select a task'}
            </span>
            <div className="absolute -right-[18px]">
              <RightArrow />
            </div>
          </div>
        </button>
      </Tooltip>
      <div
        ref={wrapperRef}
        className={`cursor-default w-screen h-screen sm:w-[calc(100vw-56px)] fixed top-0 left-0 sm:left-[55px] right-0 z-10 bg-transparent ${showSelector ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="sm:w-[30rem] w-[90vw] h-[56%] sm:h-1/2 z-20 absolute -bottom-4 left-1/2 trasnform -translate-x-1/2 transition-transform delay-300 bg-transparent p-4 py-6 rounded-t-3xl overflow-y-scroll scrollbar-hide select-none translate-y-0">
          <TaskSelector
            open={showSelector}
            escape={() => setShowSelector(false)}
          />
        </div>
      </div>
    </div>
  );
}
