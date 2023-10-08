"use client";

import { Plus } from 'lucide-react'

import { ActionTooltip } from '../action.tooltip'
import { useModal } from '@/hooks/use-model-store'

export const NavigationAction = () => {
  
  const { onOpen } = useModal()
  
  return (
    <div>
      <ActionTooltip side="right" align='center' label='Add a server'>
      <button onClick={()=>onOpen('createServer')} className='group flex items-center'>
        <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:first-letter:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 ">
          <Plus className='group-hover:text-white transition text-emerald-500'/>
        </div>
      </button>
      </ActionTooltip>
    </div>
  )
}
