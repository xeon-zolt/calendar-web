import * as React from 'react'
import * as blockstack from 'blockstack'
import FAQs from '../FAQ'
import QuestionsWeb from './QuestionsWeb'

interface IProps {
	user?: blockstack.Profile
}

const Help: React.FC<IProps> = (props: IProps) => (
	<>
		<QuestionsWeb />
		<FAQs />
	</>
)

export default Help
