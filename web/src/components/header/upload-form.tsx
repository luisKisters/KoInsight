import { Button, FileInput, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { FormEvent, JSX, useState } from 'react';
import { uploadDbFile } from '../../api/upload-db-file';
import { mutate } from 'swr';

export function UploadForm(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadDbFile(formData);

      if (response.ok) {
        // FIXME: this doesn't seem to work.
        await mutate('books');
        notifications.show({
          title: 'Success',
          message: 'File uploaded and validated successfully.',
          position: 'top-center',
          color: 'green',
        });
        setMessage('');
        close();
      } else {
        setMessage('Failed to upload file.');
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  };

  return (
    <>
      <Modal
        title={<Text fw="600">Upload Koreader Database</Text>}
        opened={modalOpened}
        onClose={close}
      >
        <Flex direction="column" gap="sm">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <FileInput
              label="Choose Database file"
              placeholder="statistics.sqlite3"
              onChange={(e) => setFile(e)}
              accept=".sqlite,.sqlite3"
              mb="sm"
            />
            <Button type="submit">Upload</Button>
          </form>
          {message && <p>{message}</p>}
        </Flex>
      </Modal>
      <Button leftSection={<IconUpload size={16} />} onClick={open} variant="light" size="xs">
        Upload DB
      </Button>
    </>
  );
}
